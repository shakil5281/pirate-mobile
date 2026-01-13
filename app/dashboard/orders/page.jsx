"use client"

import React, { useEffect, useState } from 'react';
import {
  FileText,
  Copy,
  Calendar,
  DollarSign,
  CheckCircle,
  Globe,
  BarChart3,
  Clock,
  Download,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getToken as getStoredToken } from '@/lib/utils/tokenStorage';
import { Spinner } from '@/components/ui/spinner';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.piratemobile.gg';

const formatDateValue = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : 'N/A';
  }

  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const safeFormatCurrency = (amount, currency = 'USD') => {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount);
  if (Number.isNaN(numericAmount)) {
    return amount ? String(amount) : '$0.00';
  }

  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency || 'USD'
    }).format(numericAmount);
  } catch (error) {
    return `$${numericAmount.toFixed(2)}`;
  }
};

const formatAmount = (order) => {
  if (!order) return '$0.00';
  const rawAmount = order.amount ?? order.totalAmount ?? order.total ?? order.price ?? order.bundleAmount;

  if (rawAmount && typeof rawAmount === 'object') {
    const value = rawAmount.value ?? rawAmount.total ?? rawAmount.amount ?? rawAmount.price ?? rawAmount.bundleAmount;
    const currency = rawAmount.currency ?? rawAmount.currency_code ?? rawAmount.currencyCode ?? order.currency ?? order.currencyCode;
    return safeFormatCurrency(value, currency || 'USD');
  }

  const currency = order.currency ?? order.currencyCode ?? order.currency_code ?? 'USD';
  return safeFormatCurrency(rawAmount ?? 0, currency);
};

const formatDataAmount = (order) => {
  if (!order) return 'N/A';
  if (order.unlimited) return 'Unlimited';

  const amount = order.data ?? order.dataAmount ?? order.bundleAmount ?? order.planAmount;
  if (amount === undefined || amount === null) return 'N/A';

  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount);
  if (Number.isNaN(numericAmount)) return String(amount);

  if (numericAmount >= 1000) {
    const gb = numericAmount / 1000;
    return `${gb % 1 === 0 ? gb : gb.toFixed(1)} GB`;
  }

  if (numericAmount >= 1) {
    return `${numericAmount} MB`;
  }

  return `${numericAmount}`;
};

const formatDuration = (order) => {
  const duration = order?.duration ?? order?.bundleDuration ?? order?.planDuration ?? order?.days;
  if (duration === undefined || duration === null) return 'N/A';

  const numericDuration = typeof duration === 'number' ? duration : parseInt(duration, 10);
  if (!Number.isNaN(numericDuration)) {
    return `${numericDuration} days`;
  }

  return String(duration);
};

const formatStatus = (order) => {
  const statusValue = order?.status || order?.orderStatus || order?.paymentStatus || order?.state || 'Completed';
  const normalized = statusValue.toString().toLowerCase();
  let statusColor = 'text-blue-600';

  if (['completed', 'captured', 'paid', 'success', 'succeeded'].some((value) => normalized.includes(value))) {
    statusColor = 'text-green-600';
  } else if (['pending', 'processing', 'created', 'in-progress', 'in progress'].some((value) => normalized.includes(value))) {
    statusColor = 'text-yellow-600';
  } else if (['failed', 'cancel', 'void', 'declined', 'expired', 'error'].some((value) => normalized.includes(value))) {
    statusColor = 'text-red-600';
  }

  const formattedStatus = statusValue
    .toString()
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return { status: formattedStatus, statusColor };
};

const getOrderList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.orders)) return payload.orders;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
};

const normalizeOrders = (payload) => {
  const orderList = getOrderList(payload);

  return orderList.map((order, index) => {
    const { status, statusColor } = formatStatus(order);
    const invoiceNumber =
      order?.invoiceNumber ||
      order?.invoice ||
      order?.orderNumber ||
      order?.orderId ||
      order?.orderID ||
      order?.id ||
      order?._id ||
      `Order-${index + 1}`;

    return {
      key: order?.id || order?.orderId || order?.orderID || order?._id || invoiceNumber || `order-${index}`,
      invoiceNumber,
      date: formatDateValue(
        order?.date ||
          order?.createdAt ||
          order?.created_at ||
          order?.create_time ||
          order?.createdOn ||
          order?.createdDate
      ),
      amount: formatAmount(order),
      status,
      statusColor,
      country:
        order?.countryName ||
        order?.country ||
        order?.countryIso ||
        order?.countryISO ||
        order?.countryCode ||
        order?.country_code ||
        order?.bundleGroupName ||
        'N/A',
      data: formatDataAmount(order),
      duration: formatDuration(order),
      raw: order
    };
  });
};

export default function OrdersPage() {
  const { token: contextToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [copiedInvoice, setCopiedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailFetching, setDetailFetching] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const controller = new AbortController();
    const activeToken = contextToken || getStoredToken();

    if (!activeToken) {
      setError('Authentication required to load orders.');
      setLoading(false);
      return () => controller.abort();
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/order`, {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
          cache: 'no-store',
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({}));
          const message = errorBody?.message || `Unable to fetch orders (${response.status})`;
          setError(message);
          setOrders([]);
          setLoading(false);
          return;
        }

        const payload = await response.json();
        const normalizedOrders = normalizeOrders(payload);

        setOrders(normalizedOrders);
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        console.warn('Error fetching orders:', fetchError);
        setError('Unable to load your orders right now.');
        setOrders([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => controller.abort();
  }, [contextToken]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
    setPage((prev) => Math.min(prev, totalPages));
  }, [orders]);

  const copyInvoiceNumber = (invoiceNumber) => {
    if (!invoiceNumber) return;
    navigator.clipboard.writeText(invoiceNumber);
    setCopiedInvoice(invoiceNumber);
    setTimeout(() => setCopiedInvoice(null), 2000);
  };

  const getOrderIdentifier = (order) =>
    order?.raw?.id ||
    order?.raw?.orderId ||
    order?.raw?.orderID ||
    order?.raw?._id ||
    order?.invoiceNumber ||
    order?.key;

  const handleViewOrder = async (order) => {
    const orderId = getOrderIdentifier(order);
    const token = contextToken || getStoredToken();

    if (!orderId) {
      setError('Unable to identify this order for details.');
      return;
    }

    if (!token) {
      setError('Authentication required to load order details.');
      return;
    }

    setDetailFetching(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/order/single/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message = errorBody?.message || `Unable to fetch order details (${response.status})`;
        setError(message);
        return;
      }

      const details = await response.json();
      console.info('Order details', details);
    } catch (fetchError) {
      console.warn('Error fetching order details:', fetchError);
      setError('Unable to load order details right now.');
    } finally {
      setDetailFetching(false);
    }
  };

  const downloadInvoice = (order) => {
    const lines = [
      `Invoice: ${order.invoiceNumber || 'N/A'}`,
      `Date: ${order.date || 'N/A'}`,
      `Amount: ${order.amount || 'N/A'}`,
      `Status: ${order.status || 'N/A'}`
    ];

    if (order.country) lines.push(`Country: ${order.country}`);
    if (order.data) lines.push(`Data: ${order.data}`);
    if (order.duration) lines.push(`Duration: ${order.duration}`);
    if (order.raw?.bundleName) lines.push(`Plan: ${order.raw.bundleName}`);

    const element = document.createElement('a');
    const file = new Blob([lines.join('\n')], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `invoice-${order.invoiceNumber || 'order'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrders = orders.slice(startIndex, startIndex + pageSize);
  const hasOrders = orders.length > 0;
  const handlePageChange = (nextPage) => {
    const target = Math.min(Math.max(nextPage, 1), totalPages);
    setPage(target);
  };

  const getPaginationItems = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, idx) => idx + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 'ellipsis', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, 'ellipsis', currentPage, 'ellipsis', totalPages];
  };

  const paginationItems = getPaginationItems();

  return (
    <div className="flex flex-col gap-6 lg:min-h-[calc(100vh-300px)]">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-500">View and manage any eSIMs you&apos;ve purchased</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 text-gray-600">
          <Spinner className="h-6 w-6 text-gray-500" />
          <span className="ml-3 text-sm">Loading your orders...</span>
        </div>
      )}

      {!loading && hasOrders && (
        <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {paginatedOrders.map((order) => (
              <div key={order.key} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
                {/* Invoice Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-gray-900">Invoice: {order.invoiceNumber}</span>
                  </div>
                  <button
                    onClick={() => copyInvoiceNumber(order.invoiceNumber)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Copy invoice number"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Copy confirmation */}
                {copiedInvoice === order.invoiceNumber && (
                  <div className="text-xs text-green-600 mb-2">Invoice number copied!</div>
                )}

                {/* Divider */}
                <div className="my-3 h-px bg-gray-200" />

                {/* Order Details */}
                <div className="space-y-3 mb-4">
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Date:</span>
                    <span className="text-sm text-gray-900">{order.date}</span>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Amount:</span>
                    <span className="text-sm font-semibold text-gray-900">{order.amount}</span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-500">Status:</span>
                    <span className={`text-sm font-medium ${order.statusColor}`}>{order.status}</span>
                  </div>

                  {/* Country */}
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Country:</span>
                    <span className="text-sm text-gray-900">{order.country}</span>
                  </div>

                  {/* Data */}
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Data:</span>
                    <span className="text-sm text-gray-900">{order.data}</span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Duration (Days):</span>
                    <span className="text-sm text-gray-900">{order.duration}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => downloadInvoice(order)}
                    className="flex-1 h-9 rounded-full bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </button>
                  <button
                    onClick={() => handleViewOrder(order)}
                    disabled={detailFetching}
                    className="px-3 h-9 rounded-full bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-60"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {orders.length > pageSize && (
            <Pagination className="pt-2">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                </PaginationItem>
                {paginationItems.map((item, index) => (
                  <PaginationItem key={`${item}-${index}`}>
                    {item === 'ellipsis' ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={item === currentPage}
                        onClick={() => handlePageChange(item)}
                        size="icon"
                      >
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* Empty State (if no orders) */}
      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-4">You haven&apos;t purchased any eSIMs yet.</p>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Browse eSIMs
          </button>
        </div>
      )}
    </div>
  );
}
