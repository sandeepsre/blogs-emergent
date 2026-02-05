#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for CMS
Tests all CRUD operations and identifies bugs in the Express backend
"""

import requests
import json
import os
import sys
from typing import Dict, Any, Optional

class CMSBackendTester:
    def __init__(self):
        self.base_url = "http://localhost:5000"
        self.token = None
        self.user_data = None
        self.test_results = []
        self.created_resources = {
            'categories': [],
            'tags': [],
            'blogs': [],
            'comments': [],
            'contacts': []
        }
        
    def log_result(self, test_name: str, success: bool, message: str, details: Any = None):
        """Log test result"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'details': details
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def make_request(self, method: str, endpoint: str, data: Any = None, files: Any = None, headers: Dict = None) -> tuple:
        """Make HTTP request and return response and success status"""
        url = f"{self.base_url}{endpoint}"
        
        # Default headers
        default_headers = {}
        if self.token:
            default_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            default_headers.update(headers)
            
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=default_headers)
            elif method.upper() == 'POST':
                if files:
                    response = requests.post(url, data=data, files=files, headers=default_headers)
                else:
                    if data:
                        default_headers['Content-Type'] = 'application/json'
                    response = requests.post(url, json=data, headers=default_headers)
            elif method.upper() == 'PUT':
                if files:
                    response = requests.put(url, data=data, files=files, headers=default_headers)
                else:
                    if data:
                        default_headers['Content-Type'] = 'application/json'
                    response = requests.put(url, json=data, headers=default_headers)
            elif method.upper() == 'DELETE':
                response = requests.delete(url, headers=default_headers)
            elif method.upper() == 'PATCH':
                if data:
                    default_headers['Content-Type'] = 'application/json'
                response = requests.patch(url, json=data, headers=default_headers)
            else:
                return None, False
                
            return response, True
        except Exception as e:
            print(f"Request failed: {e}")
            return None, False
    
    def test_health_check(self):
        """Test health check endpoint"""
        response, success = self.make_request('GET', '/api/health')
        if success and response.status_code == 200:
            data = response.json()
            if data.get('status') == 'ok':
                self.log_result("Health Check", True, "Backend is running")
                return True
            else:
                self.log_result("Health Check", False, "Unexpected response", data)
        else:
            self.log_result("Health Check", False, f"Request failed: {response.status_code if response else 'No response'}")
        return False
    
    def test_authentication(self):
        """Test authentication endpoints"""
        print("\n=== Testing Authentication ===")
        
        # Test login with valid credentials
        login_data = {
            "email": "admin@example.com",
            "password": "Admin@123"
        }
        
        response, success = self.make_request('POST', '/api/auth/login', login_data)
        if success and response.status_code == 200:
            data = response.json()
            if 'token' in data and 'user' in data:
                self.token = data['token']
                self.user_data = data['user']
                self.log_result("Login", True, "Successfully logged in")
            else:
                self.log_result("Login", False, "Missing token or user in response", data)
                return False
        else:
            error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
            self.log_result("Login", False, f"Login failed: {error_msg}")
            return False
        
        # Test /me endpoint
        response, success = self.make_request('GET', '/api/auth/me')
        if success and response.status_code == 200:
            data = response.json()
            if 'user' in data:
                self.log_result("Get Me", True, "Successfully retrieved user info")
            else:
                self.log_result("Get Me", False, "Missing user in response", data)
        else:
            error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
            self.log_result("Get Me", False, f"Get me failed: {error_msg}")
        
        # Test logout
        response, success = self.make_request('POST', '/api/auth/logout')
        if success and response.status_code == 200:
            self.log_result("Logout", True, "Successfully logged out")
        else:
            error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
            self.log_result("Logout", False, f"Logout failed: {error_msg}")
        
        return True
    
    def test_categories_crud(self):
        """Test categories CRUD operations"""
        print("\n=== Testing Categories CRUD ===")
        
        # GET all categories
        response, success = self.make_request('GET', '/api/categories')
        if success and response.status_code == 200:
            categories = response.json()
            self.log_result("Get Categories", True, f"Retrieved {len(categories)} categories")
        else:
            error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
            self.log_result("Get Categories", False, f"Failed to get categories: {error_msg}")
        
        # CREATE category
        category_data = {
            "name": "Test Category",
            "description": "Test category description"
        }
        
        response, success = self.make_request('POST', '/api/categories', category_data)
        if success and response.status_code == 201:
            category = response.json()
            if 'id' in category:
                self.created_resources['categories'].append(category['id'])
                self.log_result("Create Category", True, "Successfully created category")
                
                # UPDATE category
                update_data = {
                    "name": "Updated Test Category",
                    "description": "Updated description"
                }
                
                response, success = self.make_request('PUT', f'/api/categories/{category["id"]}', update_data)
                if success and response.status_code == 200:
                    self.log_result("Update Category", True, "Successfully updated category")
                else:
                    error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
                    self.log_result("Update Category", False, f"Failed to update category: {error_msg}")
                
                # DELETE category (will be done in cleanup)
            else:
                self.log_result("Create Category", False, "Missing id in response", category)
        else:
            error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
            self.log_result("Create Category", False, f"Failed to create category: {error_msg}")
    
    def test_tags_crud(self):
        """Test tags CRUD operations"""
        print("\n=== Testing Tags CRUD ===")
        
        # GET all tags
        response, success = self.make_request('GET', '/api/tags')
        if success and response.status_code == 200:
            tags = response.json()
            self.log_result("Get Tags", True, f"Retrieved {len(tags)} tags")
        else:
            error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
            self.log_result("Get Tags", False, f"Failed to get tags: {error_msg}")
        
        # CREATE tag
        tag_data = {
            "name": "Test Tag"
        }
        
        response, success = self.make_request('POST', '/api/tags', tag_data)
        if success and response.status_code == 201:
            tag = response.json()
            if 'id' in tag:
                self.created_resources['tags'].append(tag['id'])
                self.log_result("Create Tag", True, "Successfully created tag")
            else:
                self.log_result("Create Tag", False, "Missing id in response", tag)
        else:
            error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
            self.log_result("Create Tag", False, f"Failed to create tag: {error_msg}")
    
    def test_blogs_crud(self):
        """Test blogs CRUD operations - Most Important"""
        print("\n=== Testing Blogs CRUD ===")
        
        # GET all blogs
        response, success = self.make_request('GET', '/api/blogs')
        if success and response.status_code == 200:
            blogs = response.json()
            self.log_result("Get Blogs", True, f"Retrieved {len(blogs)} blogs")
        else:
            error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
            self.log_result("Get Blogs", False, f"Failed to get blogs: {error_msg}")
        
        # GET blogs with status filter
        response, success = self.make_request('GET', '/api/blogs?status=published')
        if success and response.status_code == 200:
            published_blogs = response.json()
            self.log_result("Get Published Blogs", True, f"Retrieved {len(published_blogs)} published blogs")
        else:
            error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
            self.log_result("Get Published Blogs", False, f"Failed to get published blogs: {error_msg}")
        
        # CREATE blog without image
        blog_data = {
            "title": "Test Blog Post",
            "content": "This is a test blog post content with some detailed information.",
            "excerpt": "Test blog excerpt",
            "status": "published",
            "tags": json.dumps(self.created_resources['tags'][:1]) if self.created_resources['tags'] else json.dumps([])
        }
        
        if self.created_resources['categories']:
            blog_data["category_id"] = self.created_resources['categories'][0]
        
        response, success = self.make_request('POST', '/api/blogs', blog_data)
        if success and response.status_code == 201:
            blog = response.json()
            if 'id' in blog:
                self.created_resources['blogs'].append(blog['id'])
                self.log_result("Create Blog", True, "Successfully created blog")
                
                # GET blog by slug
                if 'slug' in blog:
                    response, success = self.make_request('GET', f'/api/blogs/{blog["slug"]}')
                    if success and response.status_code == 200:
                        self.log_result("Get Blog by Slug", True, "Successfully retrieved blog by slug")
                    else:
                        error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
                        self.log_result("Get Blog by Slug", False, f"Failed to get blog by slug: {error_msg}")
                
                # UPDATE blog
                update_data = {
                    "title": "Updated Test Blog Post",
                    "content": "Updated content",
                    "excerpt": "Updated excerpt",
                    "status": "draft"
                }
                
                response, success = self.make_request('PUT', f'/api/blogs/{blog["id"]}', update_data)
                if success and response.status_code == 200:
                    self.log_result("Update Blog", True, "Successfully updated blog")
                else:
                    error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
                    self.log_result("Update Blog", False, f"Failed to update blog: {error_msg}")
                
            else:
                self.log_result("Create Blog", False, "Missing id in response", blog)
        else:
            error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
            self.log_result("Create Blog", False, f"Failed to create blog: {error_msg}")
        
        # Test CREATE blog with form-data (simulating file upload)
        form_data = {
            "title": "Test Blog with Image",
            "content": "Blog content with image",
            "excerpt": "Blog excerpt",
            "status": "published",
            "tags": json.dumps(self.created_resources['tags'][:1]) if self.created_resources['tags'] else json.dumps([])
        }
        
        if self.created_resources['categories']:
            form_data["category_id"] = self.created_resources['categories'][0]
        
        # Create a dummy file for testing
        files = {'featured_image': ('test.jpg', b'fake image data', 'image/jpeg')}
        
        response, success = self.make_request('POST', '/api/blogs', form_data, files=files)
        if success and response.status_code == 201:
            blog = response.json()
            if 'id' in blog:
                self.created_resources['blogs'].append(blog['id'])
                self.log_result("Create Blog with Image", True, "Successfully created blog with image")
            else:
                self.log_result("Create Blog with Image", False, "Missing id in response", blog)
        else:
            error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
            self.log_result("Create Blog with Image", False, f"Failed to create blog with image: {error_msg}")
    
    def test_comments_crud(self):
        """Test comments CRUD operations"""
        print("\n=== Testing Comments CRUD ===")
        
        # GET all comments (admin)
        response, success = self.make_request('GET', '/api/comments')
        if success and response.status_code == 200:
            comments = response.json()
            self.log_result("Get Comments", True, f"Retrieved {len(comments)} comments")
        else:
            error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
            self.log_result("Get Comments", False, f"Failed to get comments: {error_msg}")
        
        # CREATE comment (public)
        if self.created_resources['blogs']:
            comment_data = {
                "blog_id": self.created_resources['blogs'][0],
                "author_name": "John Doe",
                "author_email": "john@example.com",
                "content": "This is a test comment on the blog post."
            }
            
            response, success = self.make_request('POST', '/api/comments', comment_data)
            if success and response.status_code == 201:
                comment = response.json()
                if 'id' in comment:
                    self.created_resources['comments'].append(comment['id'])
                    self.log_result("Create Comment", True, "Successfully created comment")
                    
                    # UPDATE comment status
                    status_data = {
                        "status": "approved"
                    }
                    
                    response, success = self.make_request('PATCH', f'/api/comments/{comment["id"]}/status', status_data)
                    if success and response.status_code == 200:
                        self.log_result("Update Comment Status", True, "Successfully updated comment status")
                    else:
                        error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
                        self.log_result("Update Comment Status", False, f"Failed to update comment status: {error_msg}")
                        
                else:
                    self.log_result("Create Comment", False, "Missing id in response", comment)
            else:
                error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
                self.log_result("Create Comment", False, f"Failed to create comment: {error_msg}")
        else:
            self.log_result("Create Comment", False, "No blogs available for testing comments")
    
    def test_contacts_crud(self):
        """Test contacts CRUD operations"""
        print("\n=== Testing Contacts CRUD ===")
        
        # CREATE contact (public)
        contact_data = {
            "name": "Jane Smith",
            "email": "jane@example.com",
            "subject": "Test Contact Message",
            "message": "This is a test contact message from the website."
        }
        
        response, success = self.make_request('POST', '/api/contacts', contact_data)
        if success and response.status_code == 201:
            contact = response.json()
            if 'id' in contact:
                self.created_resources['contacts'].append(contact['id'])
                self.log_result("Create Contact", True, "Successfully created contact")
                
                # GET all contacts (admin)
                response, success = self.make_request('GET', '/api/contacts')
                if success and response.status_code == 200:
                    contacts = response.json()
                    self.log_result("Get Contacts", True, f"Retrieved {len(contacts)} contacts")
                else:
                    error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
                    self.log_result("Get Contacts", False, f"Failed to get contacts: {error_msg}")
                
                # UPDATE contact status
                status_data = {
                    "status": "read"
                }
                
                response, success = self.make_request('PATCH', f'/api/contacts/{contact["id"]}/status', status_data)
                if success and response.status_code == 200:
                    self.log_result("Update Contact Status", True, "Successfully updated contact status")
                else:
                    error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
                    self.log_result("Update Contact Status", False, f"Failed to update contact status: {error_msg}")
                    
            else:
                self.log_result("Create Contact", False, "Missing id in response", contact)
        else:
            error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
            self.log_result("Create Contact", False, f"Failed to create contact: {error_msg}")
    
    def test_dashboard(self):
        """Test dashboard endpoints"""
        print("\n=== Testing Dashboard ===")
        
        # GET dashboard stats
        response, success = self.make_request('GET', '/api/dashboard/stats')
        if success and response.status_code == 200:
            stats = response.json()
            self.log_result("Get Dashboard Stats", True, "Successfully retrieved dashboard stats")
        else:
            error_msg = response.json().get('error', 'Unknown error') if response else 'No response'
            self.log_result("Get Dashboard Stats", False, f"Failed to get dashboard stats: {error_msg}")
    
    def cleanup_resources(self):
        """Clean up created test resources"""
        print("\n=== Cleaning Up Test Resources ===")
        
        # Delete comments
        for comment_id in self.created_resources['comments']:
            response, success = self.make_request('DELETE', f'/api/comments/{comment_id}')
            if success and response.status_code == 200:
                self.log_result("Delete Comment", True, f"Deleted comment {comment_id}")
            else:
                self.log_result("Delete Comment", False, f"Failed to delete comment {comment_id}")
        
        # Delete contacts
        for contact_id in self.created_resources['contacts']:
            response, success = self.make_request('DELETE', f'/api/contacts/{contact_id}')
            if success and response.status_code == 200:
                self.log_result("Delete Contact", True, f"Deleted contact {contact_id}")
            else:
                self.log_result("Delete Contact", False, f"Failed to delete contact {contact_id}")
        
        # Delete blogs
        for blog_id in self.created_resources['blogs']:
            response, success = self.make_request('DELETE', f'/api/blogs/{blog_id}')
            if success and response.status_code == 200:
                self.log_result("Delete Blog", True, f"Deleted blog {blog_id}")
            else:
                self.log_result("Delete Blog", False, f"Failed to delete blog {blog_id}")
        
        # Delete tags
        for tag_id in self.created_resources['tags']:
            response, success = self.make_request('DELETE', f'/api/tags/{tag_id}')
            if success and response.status_code == 200:
                self.log_result("Delete Tag", True, f"Deleted tag {tag_id}")
            else:
                self.log_result("Delete Tag", False, f"Failed to delete tag {tag_id}")
        
        # Delete categories
        for category_id in self.created_resources['categories']:
            response, success = self.make_request('DELETE', f'/api/categories/{category_id}')
            if success and response.status_code == 200:
                self.log_result("Delete Category", True, f"Deleted category {category_id}")
            else:
                self.log_result("Delete Category", False, f"Failed to delete category {category_id}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Comprehensive Backend API Testing for CMS")
        print("=" * 60)
        
        # Test health check first
        if not self.test_health_check():
            print("❌ Backend is not running. Exiting tests.")
            return False
        
        # Test authentication
        if not self.test_authentication():
            print("❌ Authentication failed. Cannot proceed with protected endpoints.")
            return False
        
        # Test all CRUD operations
        self.test_categories_crud()
        self.test_tags_crud()
        self.test_blogs_crud()
        self.test_comments_crud()
        self.test_contacts_crud()
        self.test_dashboard()
        
        # Cleanup
        self.cleanup_resources()
        
        # Print summary
        self.print_summary()
        
        return True
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r['success']])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  • {result['test']}: {result['message']}")
                    if result['details']:
                        print(f"    Details: {result['details']}")
        
        print("\n" + "=" * 60)

def main():
    """Main function to run tests"""
    tester = CMSBackendTester()
    success = tester.run_all_tests()
    
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    main()