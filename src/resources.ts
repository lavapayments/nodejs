import type { Lava } from "./client";
import {
  CheckoutSession,
  Connection,
  ConnectionsListParams,
  ConnectionsListResponse,
  CreateCheckoutSessionParams,
  Request,
  RequestsListParams,
  RequestsListResponse,
  Usage,
  UsageParams,
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
  export class CheckoutResource extends BaseResource {
    /**
     * Create a checkout session
     * @param params Checkout session parameters
     * @returns Created checkout session
     */
    async create(
      params: CreateCheckoutSessionParams,
    ): Promise<CheckoutSession> {
      return this.lava.request<CheckoutSession>("POST", "checkout_sessions", {
        data: params,
      });
    }

    /**
     * Retrieve a checkout session
     * @param checkoutSessionId Checkout session ID
     * @returns Checkout session details
     */
    async retrieve(checkoutSessionId: string): Promise<CheckoutSession> {
      return this.lava.request<CheckoutSession>(
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
    ): Promise<ConnectionsListResponse> {
      const queryParams: Record<string, string> = {};

      if (params) {
        if (params.cursor) queryParams.cursor = params.cursor;
        if (params.limit) queryParams.limit = params.limit.toString();
        if (params.reference_id) queryParams.reference_id = params.reference_id;
      }

      return this.lava.request<ConnectionsListResponse>("GET", "connections", {
        query: queryParams,
      });
    }

    /**
     * Retrieve a connection
     * @param connectionId Connection ID
     * @returns Connection details
     */
    async retrieve(connectionId: string): Promise<Connection> {
      return this.lava.request<Connection>(
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
    async list(params?: RequestsListParams): Promise<RequestsListResponse> {
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

      return this.lava.request<RequestsListResponse>("GET", "requests", {
        query: queryParams,
      });
    }

    /**
     * Retrieve a request
     * @param requestId Request ID
     * @returns Request details
     */
    async retrieve(requestId: string): Promise<Request> {
      return this.lava.request<Request>("GET", `requests/${requestId}`);
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
    async retrieve(params: UsageParams): Promise<Usage> {
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

      return this.lava.request<Usage>("GET", "usage", {
        query: queryParams,
      });
    }
  }
}
