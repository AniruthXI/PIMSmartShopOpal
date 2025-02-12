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

    uploadPaymentProof: builder.mutation({
      query: (formData) => ({
        url: `${ORDERS_URL}/${formData.get("orderId")}/upload-payment-proof`,
        method: "POST",
        body: formData,
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
      query: () => ORDERS_URL,
      providesTags: ['Order'], // ให้ข้อมูลภายใต้ tag 'Order'
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
      query: ({ id, status }) => ({
        url: `${ORDERS_URL}/${id}/pay`,
        method: "PUT",
        body: { status },
      }),
    }),

    deliverOrder: builder.mutation({
      query: ({ id, status }) => ({
        url: `${ORDERS_URL}/${id}/deliver`,
        method: "PUT",
        body: { status },
      }),
    }),

    sendOrderConfirmationEmail: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/${data.orderId}/send-confirmation`,
        method: "POST",
        body: data,
      }),
    }),

    // frontend/src/redux/api/orderApiSlice.js
    updateOrderStatus: builder.mutation({
      query: ({ orderId, type, status }) => ({
        url: `${ORDERS_URL}/${orderId}/status`,
        method: "PUT",
        body: { type, status },
      }),
      invalidatesTags: ['Order'], // ทำให้ข้อมูลที่มี tag 'Order' หมดอายุ
      // อาจเพิ่ม transformResponse ถ้าต้องการ
      transformResponse: (response) => {
        return {
          success: true,
          message: response.message,
          order: response.order
        };
      },
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useUploadPaymentProofMutation,
  useUpdatePaymentStatusMutation,
  useSendOrderConfirmationEmailMutation,
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  useUpdateOrderStatusMutation,
} = orderApiSlice;
