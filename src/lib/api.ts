// API Configuration - reads from VITE_API_BASE_URL env var, defaults to localhost:3000
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Mock data for preview environment since Java backend cannot run here
const getMockData = (key: string) => JSON.parse(localStorage.getItem(`mock_${key}`) || '[]');
const saveMockData = (key: string, data: any) => localStorage.setItem(`mock_${key}`, JSON.stringify(data));

// Initialize mock users if empty
if (getMockData('users').length === 0) {
  saveMockData('users', [{
    id: 'U-ADMIN-001',
    name: 'Super Admin',
    email: 'admin@autocare.com',
    password: 'admin',
    role: 'SUPER_ADMIN'
  }]);
}

// Initialize mock bookings if empty
if (getMockData('bookings').length === 0) {
  saveMockData('bookings', [{
    id: 'B-1',
    vehicleId: 'V-1',
    customerId: 'U-ADMIN-001',
    date: '2024-04-20',
    serviceType: 'tire',
    status: 'PENDING'
  }, {
    id: 'B-2',
    vehicleId: 'V-1',
    customerId: 'U-ADMIN-001',
    date: '2024-03-15',
    serviceType: 'brake',
    status: 'COMPLETED'
  }]);
}

async function mockApiRequest(endpoint: string, options: RequestInit = {}) {
  const body = options.body ? JSON.parse(options.body as string) : null;
  const method = options.method || 'GET';

  console.log(`[Mock API] ${method} ${endpoint}`, body);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  if (endpoint === '/users/register' && method === 'POST') {
    const users = getMockData('users');
    if (users.find((u: any) => u.email === body.email)) {
      throw new Error('User already exists');
    }
    const newUser = { ...body, id: `U-${Math.random().toString(36).substr(2, 9)}` };
    users.push(newUser);
    saveMockData('users', users);
    return newUser;
  }

  if (endpoint === '/users/login' && method === 'POST') {
    const users = getMockData('users');
    const user = users.find((u: any) => u.email === body.email && u.password === body.password);
    if (!user) throw new Error('Invalid credentials');
    return user;
  }

  if (endpoint === '/users' && method === 'GET') {
    return getMockData('users');
  }

  if (endpoint.startsWith('/users/') && method === 'GET') {
    const userId = endpoint.split('/').pop();
    const users = getMockData('users');
    const user = users.find((u: any) => u.id === userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  if (endpoint === '/users' && method === 'PUT') {
    const users = getMockData('users');
    const index = users.findIndex((u: any) => u.id === body.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...body };
      saveMockData('users', users);
      return users[index];
    }
    throw new Error('User not found');
  }

  if (endpoint.startsWith('/vehicles/owner/') && method === 'GET') {
    const ownerId = endpoint.split('/').pop();
    const vehicles = getMockData('vehicles');
    return vehicles.filter((v: any) => v.ownerId === ownerId);
  }

  if (endpoint.startsWith('/vehicles/') && method === 'GET') {
    const vehicleId = endpoint.split('/').pop();
    const vehicles = getMockData('vehicles');
    const vehicle = vehicles.find((v: any) => v.id === vehicleId);
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
  }

  if (endpoint === '/vehicles' && method === 'POST') {
    const vehicles = getMockData('vehicles');
    const newVehicle = { ...body, id: `V-${Math.random().toString(36).substr(2, 9)}` };
    vehicles.push(newVehicle);
    saveMockData('vehicles', vehicles);
    return newVehicle;
  }

  if (endpoint === '/vehicles' && method === 'PUT') {
    const vehicles = getMockData('vehicles');
    const index = vehicles.findIndex((v: any) => v.id === body.id);
    if (index !== -1) {
      vehicles[index] = body;
      saveMockData('vehicles', vehicles);
      return vehicles[index];
    }
    throw new Error('Vehicle not found');
  }

  if (endpoint.startsWith('/vehicles/') && method === 'DELETE') {
    const id = endpoint.split('/').pop();
    const vehicles = getMockData('vehicles');
    const filtered = vehicles.filter((v: any) => v.id !== id);
    saveMockData('vehicles', filtered);
    return null;
  }

  if (endpoint === '/bookings' && method === 'GET') {
    return getMockData('bookings');
  }

  if (endpoint === '/bookings' && method === 'POST') {
    const bookings = getMockData('bookings');
    const newBooking = { ...body, id: `B-${Math.random().toString(36).substr(2, 9)}`, status: 'PENDING' };
    bookings.push(newBooking);
    saveMockData('bookings', bookings);
    return newBooking;
  }

  if (endpoint.startsWith('/bookings/') && endpoint.endsWith('/status') && method === 'PATCH') {
    const id = endpoint.split('/')[2];
    const bookings = getMockData('bookings');
    const index = bookings.findIndex((b: any) => b.id === id);
    if (index !== -1) {
      bookings[index].status = body.status;
      saveMockData('bookings', bookings);
      return bookings[index];
    }
    throw new Error('Booking not found');
  }

  if (endpoint.startsWith('/bookings/customer/') && method === 'GET') {
    const customerId = endpoint.split('/').pop();
    const bookings = getMockData('bookings');
    return bookings.filter((b: any) => b.customerId === customerId);
  }

  if (endpoint.startsWith('/bookings/') && method === 'GET') {
    const id = endpoint.split('/')[2];
    const bookings = getMockData('bookings');
    const booking = bookings.find((b: any) => b.id === id);
    if (!booking) throw new Error('Booking not found');
    return booking;
  }

  if (endpoint.startsWith('/bookings/') && method === 'DELETE') {
    const id = endpoint.split('/')[2];
    const bookings = getMockData('bookings');
    const filtered = bookings.filter((b: any) => b.id !== id);
    saveMockData('bookings', filtered);
    return null;
  }

  if (endpoint === '/services' && method === 'GET') {
    return getMockData('services');
  }

  if (endpoint === '/services' && method === 'POST') {
    const services = getMockData('services');
    const newService = { ...body, id: `S-${Math.random().toString(36).substr(2, 9)}`, date: new Date().toISOString() };
    services.push(newService);
    saveMockData('services', services);
    return newService;
  }

  if (endpoint === '/services/direct' && method === 'POST') {
    const services = getMockData('services');
    const newService = { ...body, id: `S-${Math.random().toString(36).substr(2, 9)}` };
    services.push(newService);
    saveMockData('services', services);
    return newService;
  }
  if (endpoint.startsWith('/services/') && method === 'DELETE') {
    const id = endpoint.split('/').pop();
    const services = getMockData('services');
    const filtered = services.filter((s: any) => s.id !== id);
    saveMockData('services', filtered);
    return null;
  }
  if (endpoint.startsWith('/services/') && method === 'DELETE') {
    const id = endpoint.split('/').pop();
    const services = getMockData('services');
    const filtered = services.filter((s: any) => s.id !== id);
    saveMockData('services', filtered);
    return null;
  }

  if (endpoint.startsWith('/schedules/') && method === 'GET') {
    const vehicleId = endpoint.split('/').pop();
    const schedules = getMockData('schedules');
    return schedules.filter((s: any) => s.vehicleId === vehicleId);
  }

  if (endpoint === '/schedules' && method === 'POST') {
    const schedules = getMockData('schedules');
    const newSchedule = { ...body, id: `SCH-${Math.random().toString(36).substr(2, 9)}` };
    schedules.push(newSchedule);
    saveMockData('schedules', schedules);
    return newSchedule;
  }

  if (endpoint === '/payments' && method === 'GET') {
    return getMockData('payments');
  }

  if (endpoint === '/payments' && method === 'POST') {
    const payments = getMockData('payments');
    const newPayment = { ...body, id: `P-${Math.random().toString(36).substr(2, 9)}`, date: new Date().toISOString(), status: 'PAID' };
    payments.push(newPayment);
    saveMockData('payments', payments);

    // Update service status to PAID
    if (body.serviceId) {
      const services = getMockData('services');
      const serviceIndex = services.findIndex((s: any) => s.id === body.serviceId);
      if (serviceIndex !== -1) {
        services[serviceIndex].status = 'PAID';
        saveMockData('services', services);
      }
    }

    return newPayment;
  }

  // Fallback for other endpoints
  return {};
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorText = 'Something went wrong';
      try {
        const error = await response.json();
        errorText = error.error || error.message || errorText;
      } catch {
        // Not JSON, try to get text
        try {
          errorText = await response.text();
        } catch {}
      }
      throw new Error(errorText);
    }

    if (response.status === 204) return null;
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch (error: any) {
    // If fetch fails (likely because backend is not running), use mock
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return mockApiRequest(endpoint, options);
    }
    throw error;
  }
}
