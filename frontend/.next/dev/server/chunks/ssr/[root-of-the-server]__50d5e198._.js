module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/frontend/src/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiClient",
    ()=>apiClient
]);
const API_URL = ("TURBOPACK compile-time value", "http://localhost:5000/api") || 'http://localhost:5000/api';
class ApiClient {
    baseUrl;
    token = null;
    constructor(baseUrl){
        this.baseUrl = baseUrl;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    setToken(token) {
        this.token = token;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    getToken() {
        return this.token;
    }
    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }
        return data;
    }
    async uploadRequest(endpoint, formData) {
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers,
            body: formData
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Upload failed');
        }
        return data;
    }
    // Auth
    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        });
        this.setToken(data.token);
        return data;
    }
    async getMe() {
        return this.request('/auth/me');
    }
    async logout() {
        await this.request('/auth/logout', {
            method: 'POST'
        });
        this.setToken(null);
    }
    // Blogs
    async getBlogs(params) {
        const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
        return this.request(`/blogs${queryString}`);
    }
    async getBlogBySlug(slug) {
        return this.request(`/blogs/${slug}`);
    }
    async createBlog(formData) {
        return this.uploadRequest('/blogs', formData);
    }
    async updateBlog(id, formData) {
        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        const response = await fetch(`${this.baseUrl}/blogs/${id}`, {
            method: 'PUT',
            headers,
            body: formData
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Update failed');
        }
        return data;
    }
    async deleteBlog(id) {
        return this.request(`/blogs/${id}`, {
            method: 'DELETE'
        });
    }
    // Categories
    async getCategories() {
        return this.request('/categories');
    }
    async createCategory(data) {
        return this.request('/categories', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    async updateCategory(id, data) {
        return this.request(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    async deleteCategory(id) {
        return this.request(`/categories/${id}`, {
            method: 'DELETE'
        });
    }
    // Tags
    async getTags() {
        return this.request('/tags');
    }
    async createTag(data) {
        return this.request('/tags', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    async deleteTag(id) {
        return this.request(`/tags/${id}`, {
            method: 'DELETE'
        });
    }
    // Comments
    async getComments(params) {
        const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
        return this.request(`/comments${queryString}`);
    }
    async createComment(data) {
        return this.request('/comments', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    async updateCommentStatus(id, status) {
        return this.request(`/comments/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({
                status
            })
        });
    }
    async deleteComment(id) {
        return this.request(`/comments/${id}`, {
            method: 'DELETE'
        });
    }
    // Contacts
    async getContacts(params) {
        const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
        return this.request(`/contacts${queryString}`);
    }
    async createContact(data) {
        return this.request('/contacts', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    async updateContactStatus(id, status) {
        return this.request(`/contacts/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({
                status
            })
        });
    }
    async deleteContact(id) {
        return this.request(`/contacts/${id}`, {
            method: 'DELETE'
        });
    }
    // Dashboard
    async getDashboardStats() {
        return this.request('/dashboard/stats');
    }
}
const apiClient = new ApiClient(API_URL);
}),
"[project]/frontend/src/contexts/AuthContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/src/lib/api.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check if user is logged in
        const checkAuth = async ()=>{
            try {
                const token = __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].getToken();
                if (token) {
                    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].getMe();
                    setUser(response.user);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].setToken(null);
            } finally{
                setLoading(false);
            }
        };
        checkAuth();
    }, []);
    const login = async (email, password)=>{
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].login(email, password);
            setUser(response.user);
        } catch (error) {
            throw error;
        }
    };
    const logout = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiClient"].logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally{
            setUser(null);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            loading,
            login,
            logout,
            isAuthenticated: !!user
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/frontend/src/contexts/AuthContext.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
function useAuth() {
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
}),
"[project]/frontend/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/frontend/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__50d5e198._.js.map