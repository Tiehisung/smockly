import type { IBaseDocument } from "./base.types";

 

export interface IReview extends IBaseDocument {
    productId: string;
    userId: string;
    orderId?: string;

    // Content
    rating: 1 | 2 | 3 | 4 | 5;
    title: string;
    content: string;

    // Media
    images?: IReviewImage[];

    // Verification
    verified: boolean;
    verifiedPurchase: boolean;

    // Interactions
    helpful: number;
    notHelpful: number;
    reported: boolean;

    // Response
    response?: IReviewResponse;

    // Metadata
    status: 'pending' | 'approved' | 'rejected' | 'flagged';
    helpfulVotes: string[]; // User IDs
    notHelpfulVotes: string[];
    reports: IReviewReport[];
    
}

export interface IReviewImage {
    url: string;
    caption?: string;
    isPrimary?: boolean;
}

export interface IReviewResponse {
    content: string;
    respondedBy: string;
    respondedAt: string;
    isOfficial: boolean;
}

export interface IReviewReport {
    userId: string;
    reason: string;
    description?: string;
    reportedAt: string;
    resolvedAt?: string;
    resolvedBy?: string;
}

// Review Form Types
export interface ICreateReviewData {
    productId: string;
    rating: number;
    title: string;
    content: string;
    images?: File[];
}

export interface IReviewFilters {
    productId: string;
    rating?: number;
    verified?: boolean;
    withImages?: boolean;
    sortBy: 'recent' | 'helpful' | 'rating';
    page: number;
    limit: number;
}

// Review Stats
export interface IProductReviewStats {
    productId: string;
    averageRating: number;
    totalReviews: number;
    distribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
    verifiedCount: number;
    withImagesCount: number;
}