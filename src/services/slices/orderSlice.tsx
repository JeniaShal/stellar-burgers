import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export type TOrderSlice = {
  orderData: TOrder | null;
  orderRequest: boolean;
  isLoading: boolean;
  postOrderError: string | null;
  fetchOrderByIdError: string | null;
};

export const initialState: TOrderSlice = {
  orderData: null,
  orderRequest: false,
  isLoading: false,
  postOrderError: null,
  fetchOrderByIdError: null
};

export const postOrder = createAsyncThunk(
  'order/post',
  async (data: string[]) => {
    const order = await orderBurgerApi(data);
    return order;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (data: number) => {
    const orderData = await getOrderByNumberApi(data);
    console.log(orderData);
    return orderData.orders;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderData = null;
    }
  },
  selectors: {
    selectOrderData: (state) => state.orderData,
    selectOrderRequest: (state) => state.orderRequest
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.isLoading = false;
        state.postOrderError = 'Ошибка размещения заказа';
      })
      .addCase(postOrder.pending, (state) => {
        state.orderRequest = true;
        state.isLoading = true;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.orderData = action.payload.order;
        state.isLoading = false;
        state.orderRequest = false;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.isLoading = false;
        state.fetchOrderByIdError = 'Ошибка загрузки заказа';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.isLoading = true;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderRequest = true;
        let res = state.orderData as TOrder;
        res = action.payload.find((order) => {
          if (state.orderData != null) {
            order.number === state.orderData.number;
          }
        }) as TOrder;
      });
  }
});

export const { selectOrderData, selectOrderRequest } = orderSlice.selectors;
export const { clearOrderData } = orderSlice.actions;
export default orderSlice.reducer;
