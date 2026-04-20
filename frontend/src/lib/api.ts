// API client utility for consistent API calls and error handling

const API_BASE_URL = '/api';

// For production deployment, use the production backend URL from env or fallback to current origin
const PRODUCTION_BACKEND_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
const isProduction = import.meta.env.PROD;

// Use backend URL in development
const DEV_BACKEND_URL = 'http://localhost:5000';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
  statusText?: string;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Use backend URL in development, direct backend URL in production
      const baseUrl = isProduction ? PRODUCTION_BACKEND_URL : DEV_BACKEND_URL;
      const url = `${baseUrl}${API_BASE_URL}${endpoint}`;

      // API request logging removed for cleaner output

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'text/plain',
          ...options.headers,
        },
        ...options,
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          data = null;
        }
      } else {
        // Handle non-JSON responses (like plain text errors)
        data = await response.text();
      }

      if (!response.ok) {
        // Log detailed error in development
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ API Error Response:', {
            status: response.status,
            statusText: response.statusText,
            data: data,
            url: url,
            requestBody: options.body,
            requestHeaders: options.headers
          });
        }

        // Better error handling for different response types
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorData = null;

        if (typeof data === 'object' && data !== null) {
          errorMessage = data.error || data.message || errorMessage;
          errorData = data;
        } else if (typeof data === 'string') {
          errorMessage = data || errorMessage;
          errorData = { message: data };
        }

        // Handle specific HTTP status codes
        if (response.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
        }

        return {
          success: false,
          error: errorMessage,
          ...errorData,
          status: response.status,
          statusText: response.statusText
        };
      }

      // If backend wraps payload in an object like { success: true, data: ... },
      // unwrap so callers receive the inner payload directly.
      if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
        data = (data as any).data;
      }

      console.log('✅ API Success Response:', {
        status: response.status,
        url: url,
        dataKeys: data ? Object.keys(data) : 'No data'
      });

      return {
        success: true,
        data,
        message: (data && (data as any).message) || undefined,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  // Course API methods
  async getCourses() {
    const token = localStorage.getItem('adminToken');
    const res = await this.request('/admin/courses', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    // Backend returns a wrapped response `{ success: true, data: [...] }` inside the
    // API client's `data` field. Unwrap it so callers get the raw array.
    if (res.success && res.data && typeof res.data === 'object' && 'data' in (res.data as any)) {
      return {
        ...res,
        data: (res.data as any).data
      } as any;
    }

    return res;
  }

  async getActiveCourses() {
    const token = localStorage.getItem('adminToken');
    return this.request('/courses/active', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async getCourseById(id: string) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/courses/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async createCourse(courseData: Record<string, unknown>) {
    const token = localStorage.getItem('adminToken');
    return this.request('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async updateCourse(id: string, courseData: Record<string, unknown>) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async toggleCourseStatus(id: string) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/courses/${id}/toggle`, {
      method: 'PATCH',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async deleteCourse(id: string) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/courses/${id}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  // Enrollment API methods
  async completeEnrollment(enrollmentData: Record<string, unknown>) {
    return this.request('/enrollment/complete', {
      method: 'POST',
      body: JSON.stringify(enrollmentData),
    });
  }

  // Public Admission API
  async getAdmissionStatus() {
    return this.request('/admission/status');
  }

  async incrementEnrollments() {
    return this.request('/admission/increment-enrollments', {
      method: 'POST'
    });
  }

  // Student API methods
  async getStudents() {
    return this.request('/students');
  }

  async createStudent(studentData: Record<string, unknown>) {
    return this.request('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  }

  async updateStudent(id: string, studentData: Record<string, unknown>) {
    return this.request(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  }

  async deleteStudent(id: string) {
    return this.request(`/students/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin API methods
  async loginAdmin(credentials: { username: string; password: string }) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getPayments() {
    return this.request('/admin/payments');
  }

  async getReports() {
    return this.request('/admin/reports');
  }

  // Admin Panel API methods
  async getAdminFAQs(status?: string) {
    const token = localStorage.getItem('adminToken');
    const params = status ? `?status=${status}` : '';
    return this.request(`/admin/faqs${params}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async createFAQ(faqData: Record<string, unknown>) {
    const token = localStorage.getItem('adminToken');
    return this.request('/admin/faqs', {
      method: 'POST',
      body: JSON.stringify(faqData),
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async updateFAQ(id: string, faqData: Record<string, unknown>) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(faqData),
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async toggleFAQStatus(id: string) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/faqs/${id}/toggle`, {
      method: 'PATCH',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async deleteFAQ(id: string) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/faqs/${id}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  // Public FAQ API
  async getFAQs() {
    return this.request('/faqs');
  }

  async getAdminTestimonials(status?: string) {
    const token = localStorage.getItem('adminToken');
    const params = status ? `?status=${status}` : '';
    return this.request(`/admin/testimonials${params}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async createAdminTestimonial(testimonialData: Record<string, unknown>) {
    const token = localStorage.getItem('adminToken');
    return this.request('/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async updateTestimonial(id: string, testimonialData: Record<string, unknown>) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonialData),
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async approveTestimonial(id: string, approvalData: Record<string, unknown>) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/testimonials/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify(approvalData),
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async deleteTestimonial(id: string) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  // Public Testimonial API
  async getTestimonials() {
    return this.request('/testimonials');
  }

  async createPublicTestimonial(testimonialData: Record<string, unknown>) {
    return this.request('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData)
    });
  }

  async getHomeContent() {
    return this.request('/home-content');
  }

  async getAdminHomeContent() {
    const token = localStorage.getItem('adminToken');
    return this.request('/admin/home-content', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async updateHomeContent(contentData: Record<string, unknown>) {
    const token = localStorage.getItem('adminToken');
    return this.request('/admin/home-content', {
      method: 'POST',
      body: JSON.stringify(contentData),
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async toggleHomeContentSection(section: string) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/home-content/${section}/toggle`, {
      method: 'PATCH',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async reorderHomeContentSections(orderData: Record<string, unknown>) {
    const token = localStorage.getItem('adminToken');
    return this.request('/admin/home-content/reorder', {
      method: 'POST',
      body: JSON.stringify(orderData),
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async getAdmissionSettings() {
    const token = localStorage.getItem('adminToken');
    return this.request('/admin/admission/settings', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async updateAdmissionSettings(settingsData: Record<string, unknown>) {
    const token = localStorage.getItem('adminToken');
    return this.request('/admin/admission/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async resetEnrollments() {
    const token = localStorage.getItem('adminToken');
    return this.request('/admin/admission/reset-enrollments', {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  // Admin Authentication API methods
  async verifyAdminToken() {
    const token = localStorage.getItem('adminToken');
    console.log('🔍 Verifying admin token...');
    console.log('💾 Token found:', !!token);

    if (!token) {
      console.log('❌ No token found for verification');
      return { success: false, error: 'No token found' };
    }

    console.log('💾 Token length for verification:', token.length);

    return this.request('/admin/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // Razorpay Payment API methods
  async createRazorpayOrder(orderData: Record<string, unknown>) {
    return this.request('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async verifyRazorpayPayment(paymentData: Record<string, unknown>) {
    return this.request('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getPaymentStatus(paymentId: string) {
    return this.request(`/payment/status/${paymentId}`);
  }

  async processEnrollmentWithPayment(enrollmentData: Record<string, unknown>) {
    console.log('📤 Processing enrollment with payment:', enrollmentData);
    const response = await this.request('/payment/process-enrollment', {
      method: 'POST',
      body: JSON.stringify(enrollmentData),
    });
    console.log('📥 Enrollment response:', response);
    return response;
  }

  // Fee Structure API methods
  async getFeeStructures(filters?: Record<string, unknown>) {
    const params = filters ? `?${new URLSearchParams(filters as any).toString()}` : '';
    return this.request(`/fee-structures${params}`);
  }

  async getAdminFeeStructures() {
    const token = localStorage.getItem('adminToken');
    return this.request('/admin/fee-structures', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async getFeeStructureById(id: string) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/fee-structures/${id}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async createFeeStructure(feeData: Record<string, unknown>) {
    const token = localStorage.getItem('adminToken');
    return this.request('/admin/fee-structures', {
      method: 'POST',
      body: JSON.stringify(feeData),
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async updateFeeStructure(id: string, feeData: Record<string, unknown>) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/fee-structures/${id}`, {
      method: 'PUT',
      body: JSON.stringify(feeData),
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async toggleFeeStructureStatus(id: string) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/fee-structures/${id}/toggle`, {
      method: 'PATCH',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async deleteFeeStructure(id: string) {
    const token = localStorage.getItem('adminToken');
    return this.request(`/admin/fee-structures/${id}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
  }

  async calculateFee(feeCriteria: Record<string, unknown>) {
    return this.request('/fee-structures/calculate', {
      method: 'POST',
      body: JSON.stringify(feeCriteria),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types
export type { ApiResponse };