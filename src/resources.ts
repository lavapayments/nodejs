import type { Lava } from "./client";
import {
  CheckoutSessionsListParams,
  ConnectionsListParams,
  CreateCheckoutSessionParams,
  ListResponse,
  RequestsListParams,
  RestCheckoutSession,
  RestConnection,
  RestRequest,
  RestUsage,
  UsageParams,
  CreateRequestParams,
} from "./types";

export namespace Resources {
  abstract class BaseResource {
    protected lava: Lava;

    constructor(lava: Lava) {
      this.lava = lava;
    }
  }

  /**
   * Checkout session related endpoints
   */
  export class CheckoutSessionsResource extends BaseResource {
    /**
     * Create a checkout session
     * @param params Checkout session parameters
     * @returns Created checkout session
     */
    async create(
      params: CreateCheckoutSessionParams,
    ): Promise<RestCheckoutSession> {
      return this.lava.request<RestCheckoutSession>(
        "POST",
        "checkout_sessions",
        {
          data: params,
        },
      );
    }

    /**
     * List checkout sessions
     * @param params List parameters
     * @returns Paginated list of checkout sessions
     */
    async list(
      params?: CheckoutSessionsListParams,
    ): Promise<ListResponse<RestCheckoutSession>> {
      const queryParams: Record<string, string> = {};

      if (params) {
        if (params.cursor) queryParams.cursor = params.cursor;
        if (params.limit) queryParams.limit = params.limit.toString();
        if (params.reference_id) queryParams.reference_id = params.reference_id;
      }

      return this.lava.request<ListResponse<RestCheckoutSession>>(
        "GET",
        "checkout_sessions",
        {
          query: queryParams,
        },
      );
    }

    /**
     * Retrieve a checkout session
     * @param checkoutSessionId Checkout session ID
     * @returns Checkout session details
     */
    async retrieve(checkoutSessionId: string): Promise<RestCheckoutSession> {
      return this.lava.request<RestCheckoutSession>(
        "GET",
        `checkout_sessions/${checkoutSessionId}`,
      );
    }
  }

  /**
   * Connection related endpoints
   */
  export class ConnectionsResource extends BaseResource {
    /**
     * List connections
     * @param params List parameters
     * @returns Paginated list of connections
     */
    async list(
      params?: ConnectionsListParams,
    ): Promise<ListResponse<RestConnection>> {
      const queryParams: Record<string, string> = {};

      if (params) {
        if (params.cursor) queryParams.cursor = params.cursor;
        if (params.limit) queryParams.limit = params.limit.toString();
        if (params.reference_id) queryParams.reference_id = params.reference_id;
      }

      return this.lava.request<ListResponse<RestConnection>>(
        "GET",
        "connections",
        {
          query: queryParams,
        },
      );
    }

    /**
     * Retrieve a connection
     * @param connectionId Connection ID
     * @returns Connection details
     */
    async retrieve(connectionId: string): Promise<RestConnection> {
      return this.lava.request<RestConnection>(
        "GET",
        `connections/${connectionId}`,
      );
    }

    /**
     * Delete a connection
     * @param connectionId Connection ID
     * @returns Success status
     */
    async delete(connectionId: string): Promise<{ success: boolean }> {
      return this.lava.request<{ success: boolean }>(
        "DELETE",
        `connections/${connectionId}`,
      );
    }
  }

  /**
   * Request related endpoints
   */
  export class RequestsResource extends BaseResource {
    /**
     * List requests
     * @param params List parameters
     * @returns Paginated list of requests
     */
    async list(
      params?: RequestsListParams,
    ): Promise<ListResponse<RestRequest>> {
      const queryParams: Record<string, string> = {};

      if (params) {
        if (params.cursor) queryParams.cursor = params.cursor;
        if (params.limit) queryParams.limit = params.limit.toString();
        if (params.connection_id)
          queryParams.connection_id = params.connection_id;
        if (params.product_id) queryParams.product_id = params.product_id;
        if (params.metadata_filters)
          queryParams.metadata_filters = JSON.stringify(
            Object.entries(params.metadata_filters),
          );
      }

      return this.lava.request<ListResponse<RestRequest>>("GET", "requests", {
        query: queryParams,
      });
    }

    /**
     * Create a request
     * @param params Request parameters
     * @returns Created request details
     */
    async create(params: CreateRequestParams): Promise<RestRequest> {
      return this.lava.request<RestRequest>("POST", "requests", {
        data: params,
      });
    }

    /**
     * Retrieve a request
     * @param requestId Request ID
     * @returns Request details
     */
    async retrieve(requestId: string): Promise<RestRequest> {
      return this.lava.request<RestRequest>("GET", `requests/${requestId}`);
    }
  }

  /**
   * Usage related endpoints
   */
  export class UsageResource extends BaseResource {
    /**
     * Retrieve usage statistics
     * @param params Usage parameters
     * @returns Usage data
     */
    async retrieve(params: UsageParams): Promise<RestUsage> {
      const queryParams: Record<string, string> = {
        start: params.start,
      };

      if (params.end) queryParams.end = params.end;
      if (params.connection_id)
        queryParams.connection_id = params.connection_id;
      if (params.product_id) queryParams.product_id = params.product_id;
      if (params.metadata_filters)
        queryParams.metadata_filters = JSON.stringify(
          Object.entries(params.metadata_filters),
        );

      return this.lava.request<RestUsage>("GET", "usage", {
        query: queryParams,
      });
    }
  }
}
