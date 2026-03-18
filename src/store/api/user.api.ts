import type { EUserRole, EUserStatus, IUser } from '../../types/user.types';
import type { IApiResponse, IQueryParams } from '../../types';
import { baseApi } from './baseApi';
import type { IAddress } from '../../types/shop.types';

// Types

export interface IUpdateProfileData {
    displayName?: string;
    bio?: string;
    location?: string;
    website?: string;
    preferences?: Partial<IUser['preferences']>;
}

export interface ICreateUserData {
    firebaseUid: string;
    email: string;
    displayName?: string | null;
    photoURL?: string | null;
}

interface UserResponse {
    success: boolean;
    data: IUser;
}

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get current user
        getCurrentUser: builder.query<IUser, void>({
            query: () => '/users/me',
            providesTags: ['User'],
            transformResponse: (response: UserResponse) => response.data,
        }),

        // Get user by ID
        getUserById: builder.query<IUser, string>({
            query: (userId) => `/users/${userId}`,
            providesTags: ['User'],
            transformResponse: (response: UserResponse) => response.data,
        }),

        // Search users
        searchUsers: builder.query<
            IApiResponse['data'],
            { query?: string; page?: number; limit?: number; role?: string }
        >({
            query: (params) => ({
                url: '/users/search',
                params,
            }),
            providesTags: ['Users'],
            transformResponse: (response: IApiResponse) => response.data,
        }),

        // Create user (signup)
        createUser: builder.mutation<IUser, ICreateUserData>({
            query: (userData) => ({
                url: '/users/create',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['Users'],
            transformResponse: (response: UserResponse) => response.data,
        }),

        // Update user profile
        updateUserProfile: builder.mutation<IUser, IUpdateProfileData>({
            query: (profileData) => ({
                url: '/users/profile',
                method: 'PUT',
                body: profileData,
            }),
            invalidatesTags: ['Users'],
            transformResponse: (response: UserResponse) => response.data,
        }),

        // Stats
        getUserStats: builder.query<any, void>({
            query: () => '/users/stats',
            providesTags: ['UserStats']
        }),

        // Addresses
        getAddresses: builder.query<IApiResponse<IAddress[]>, void>({
            query: () => '/users/addresses',
            providesTags: ['Addresses']
        }),

        addAddress: builder.mutation<IApiResponse<IAddress[]>, IAddress>({
            query: (address) => ({
                url: '/users/addresses',
                method: 'POST',
                body: address
            }),
            invalidatesTags: ['Addresses']
        }),

        updateAddress: builder.mutation<IApiResponse<IAddress[]>, { addressId: string; data: Partial<IAddress> }>({
            query: ({ addressId, data }) => ({
                url: `/users/addresses/${addressId}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Addresses']
        }),
        deleteAddress: builder.mutation<IApiResponse<IAddress[]>, string>({
            query: (addressId) => ({
                url: `/users/addresses/${addressId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Addresses']
        }),

        // Wishlist
        getWishlist: builder.query<any[], void>({
            query: () => '/users/wishlist',
            providesTags: ['Wishlist']
        }),

        addToWishlist: builder.mutation<void, string>({
            query: (productId) => ({
                url: `/users/wishlist/${productId}`,
                method: 'POST'
            }),
            invalidatesTags: ['Wishlist']
        }),

        removeFromWishlist: builder.mutation<void, string>({
            query: (productId) => ({
                url: `/users/wishlist/${productId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Wishlist']
        }),

        // Delete own account
        deleteOwnAccount: builder.mutation<IApiResponse, { confirmation: string }>({
            query: ({ confirmation }) => ({
                url: '/users/account',
                method: 'DELETE',
                body: { confirmation },
            }),
            invalidatesTags: ['Users',],
        }),

        // Admin: Get all users
        getAllUsers: builder.query<
            IApiResponse<IUser[]>,
            IQueryParams
        >({
            query: (params) => ({
                url: '/users',
                params,
            }),
            providesTags: ['Users',],
            // transformResponse: (response: IApiResponse) => response.data,
        }),

        // Admin: Update user role
        updateAuthUser: builder.mutation<IApiResponse, { _id: string; role?: EUserRole, displayName?: string, status?: EUserStatus }>({
            query: ({ _id, ...rest }) => ({
                url: `/users/auth/${_id}`,
                method: 'PUT',
                body: rest,
            }),
            invalidatesTags: ['Users', 'User'],
            // transformResponse: (response: UserResponse) => response,
        }),

        // Admin: Delete any user
        adminDeleteUser: builder.mutation<IApiResponse, string>({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Users'],
        }),

        // Update last login
        updateLastLogin: builder.mutation<void, { uid: string }>({
            query: ({ uid }) => ({
                url: '/users/last-login',
                method: 'POST',
                body: { uid },
            }),
        }), 
       
    }),
})

// Export hooks for usage in components
export const {
    useGetCurrentUserQuery,
    useGetUserByIdQuery,
    useSearchUsersQuery,
    useCreateUserMutation,
    useUpdateUserProfileMutation,
    useDeleteOwnAccountMutation,
    useGetAllUsersQuery,
    useUpdateAuthUserMutation,
    
    useAdminDeleteUserMutation,
    useUpdateLastLoginMutation,
    useGetAddressesQuery,
    useAddAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
    useGetWishlistQuery,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
    useGetUserStatsQuery,
  
} = userApi;