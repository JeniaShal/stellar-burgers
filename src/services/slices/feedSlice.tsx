import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const getFeeds = createAsyncThunk('orders/get', async () => {
  const fetchFeed = getFeedsApi();
  return fetchFeed;
});

export type TFeedSlice = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  feed: {
    total: number;
    totalToday: number;
  };
  // order: TOrder|null
};

export const initialState: TFeedSlice = {
  orders: [],
  isLoading: false,
  error: null,
  feed: {
    total: 0,
    totalToday: 0
  }
  // order: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    // findOrder: (state, action: <number: number) => {
    //   state.orders.find(order => {order.number === number} )
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = 'Ошибка загрузки ленты';
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.feed.total = action.payload.total;
        state.feed.totalToday = action.payload.totalToday;
      });
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectFeed: (state) => state.feed
    // selectOrder:
  }
});

export const { selectOrders, selectFeed } = feedSlice.selectors;
export const feedSliceName = feedSlice.name;
export default feedSlice.reducer;
