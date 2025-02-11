import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),

    // สำหรับส่วนที่ต้องแก้ไขใน orderApiSlice.js
    uploadPaymentProof: builder.mutation({
      query: (formData) => ({
        url: `${ORDERS_URL}/${formData.get("orderId")}/upload-payment-proof`,
        method: "POST",
        body: formData,
        // เพิ่ม formData flag เพื่อให้ RTK Query จัดการ content-type ให้ถูกต้อง
        formData: true,
      }),
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
    }),

    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),

    getTotalOrders: builder.query({
      query: () => `${ORDERS_URL}/total-orders`,
    }),

    getTotalSales: builder.query({
      query: () => `${ORDERS_URL}/total-sales`,
    }),

    getTotalSalesByDate: builder.query({
      query: () => `${ORDERS_URL}/total-sales-by-date`,
    }),

    updatePaymentStatus: builder.mutation({
      query: ({ orderId, isPaid }) => ({
        url: `/api/orders/${orderId}/pay`,
        method: 'PUT',
        body: { isPaid }
      }),
    }),

    sendOrderConfirmationEmail: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/${data.orderId}/send-confirmation`,
        method: 'POST',
        body: data
      })
    })
  }),
});



export const {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  // ------------------
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useGetOrdersQuery,
  useUploadPaymentProofMutation,
  useUpdatePaymentStatusMutation,
  useSendOrderConfirmationEmailMutation,
} = orderApiSlice;
