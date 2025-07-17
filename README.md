# HMS Frontend Desktop Application

A modern Hotel Management System (HMS) desktop application built with React, TypeScript, Vite, and Electron. This application provides comprehensive hotel operations management including reservations, guest management, housekeeping, maintenance, and financial operations.

## 🏨 Features

### Core Modules
- **Dashboard** - Real-time hotel operations overview
- **Reservations Management** - Individual and group booking management
- **Guest Management** - Guest profiles and preferences
- **Room Management** - Room types, availability, and status tracking
- **Housekeeping** - Room cleaning and maintenance scheduling
- **Maintenance** - Equipment and facility maintenance tracking
- **Team Members** - Staff management and role-based access control
- **Financial Management** - Charges, payments, and folio management

### Key Capabilities
- **Check-in/Check-out** - Streamlined guest arrival and departure processes
- **Payment Processing** - Multiple payment methods and currency support
- **Charge Management** - Room charges, taxes, and additional services
- **Role-based Permissions** - Secure access control using CASL
- **Real-time Updates** - Live data synchronization
- **Multi-currency Support** - International payment processing

## 🛠️ Technology Stack

### Frontend Framework
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Electron** - Desktop application wrapper

### UI Components & Styling
- **Shadcn/UI** - Modern component library
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### State Management & Data
- **Redux Toolkit** - Predictable state management
- **React Redux** - React bindings for Redux
- **Redux Persist** - State persistence
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing

### Form Handling & Validation
- **Zod** - TypeScript-first schema validation
- **React Hook Form** - Performant form library
- **Date-fns** - Modern date utility library

### Additional Libraries
- **CASL** - Permission and access control
- **Sonner** - Toast notifications
- **PostHog** - Analytics and feature flags

## 📁 Project Structure

```
src/
├── api/                    # API configuration and endpoints
│   ├── axiosInstance.ts    # Axios configuration
│   ├── base.ts            # Base API client
│   └── endpoints.ts       # API endpoint definitions
├── components/            # Reusable UI components
│   ├── atoms/             # Basic UI elements (Button, Input, etc.)
│   ├── molecules/         # Composite components (AlertDialog, Calendar)
│   ├── Organisms/         # Complex components
│   ├── Templates/         # Page templates
│   └── dialogs/          # Modal dialogs
├── context/              # React context providers
│   ├── CASLContext.tsx   # Permission context
│   └── DialogContext.tsx # Dialog state management
├── hooks/                # Custom React hooks
├── layout/               # Layout components
├── lib/                  # Utility libraries
│   ├── utils.ts          # Common utilities
│   └── ability/          # CASL permission definitions
├── pages/                # Application pages
│   ├── Dashboard.tsx     # Main dashboard
│   ├── Reservations/     # Reservation management
│   ├── Guests/          # Guest management
│   ├── Room/            # Room management
│   ├── Housekeeping/    # Housekeeping module
│   ├── Maintenance/     # Maintenance module
│   ├── TeamMembers/     # Staff management
│   └── management/      # Administrative functions
├── redux/                # Redux store and slices
├── routes/               # Route definitions
├── services/             # API service functions
│   ├── Auth.ts          # Authentication services
│   ├── Reservation.ts   # Reservation operations
│   ├── Guests.ts        # Guest management
│   ├── Rooms.ts         # Room operations
│   ├── Charges.ts       # Charge management
│   └── ...              # Other service modules
├── types/                # TypeScript type definitions
├── validation/           # Zod schemas and validation
│   └── schemas/         # Schema definitions
└── App.tsx              # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alaa-shouman/HMS-fe-desktop.git
   cd HMS-fe-desktop
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_FRONTDESK_SERVICE_URL=your_api_base_url
   VITE_POSTHOG_KEY=your_posthog_key (optional)
   ```

4. **Development Server**
   ```bash
   yarn dev
   ```

5. **Build for Production**
   ```bash
   yarn build
   ```

## 🏗️ Architecture Overview

### Component Architecture
The application follows atomic design principles:
- **Atoms**: Basic UI elements (Button, Input, Label)
- **Molecules**: Combinations of atoms (SearchBar, FormField)
- **Organisms**: Complex UI sections (ReservationForm, GuestTable)
- **Templates**: Page layouts
- **Pages**: Complete views with business logic

### State Management
- **Redux Store**: Global application state
- **Local State**: Component-specific state using useState
- **Context**: Shared state for permissions and dialogs

### Data Flow
1. **Services**: API calls and data transformation
2. **Redux Actions**: State updates
3. **Components**: React to state changes
4. **UI Updates**: Automatic re-rendering

## 🔐 Authentication & Permissions

The application uses role-based access control (RBAC) with CASL:

### Roles
- **Admin**: Full system access
- **Manager**: Hotel operations management
- **Front Desk**: Guest services and reservations
- **Housekeeping**: Room status and cleaning
- **Maintenance**: Equipment and facility management

### Permission System
```typescript
// Example permission check
const { can } = useAbility();

if (can('create', 'Reservation')) {
  // Show create reservation button
}
```

## 📊 Key Features Documentation

### Reservation Management
- **Individual Reservations**: Single guest bookings
- **Group Reservations**: Multiple room bookings
- **Check-in/Check-out**: Guest arrival and departure processing
- **Modification**: Reservation updates and changes
- **Cancellation**: Booking cancellations with policies

### Payment Processing
- **Multiple Payment Methods**: Cash, credit card, bank transfer
- **Multi-currency Support**: International transactions
- **Folio Management**: Guest account management
- **Charge Routing**: Individual vs. group billing

### Room Management
- **Room Types**: Different accommodation categories
- **Availability Tracking**: Real-time room status
- **Rate Plans**: Flexible pricing strategies
- **Maintenance Scheduling**: Proactive room care

## 🧪 Development Guidelines

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting (if configured)
- **Component Props**: Always type component props
- **Error Handling**: Comprehensive error boundaries

### API Integration
```typescript
// Service function example
export const getReservationById = async (reservationId: string): Promise<GetSingleReservationResponse> => {
  try {
    const response = await apiClient({
      method: "GET",
      endpoint: `${ENDPOINTS.Reservations.GetId}/${reservationId}`,
      baseURL,
    });
    return response as GetSingleReservationResponse;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "Failed to get reservation";
    throw {
      userMessage: errorMessage,
      originalError: error,
    };
  }
};
```

### Validation
All forms use Zod schemas for validation:
```typescript
export const ReservationSchema = z.object({
  checkIn: z.string(),
  checkOut: z.string(),
  guestId: z.string(),
  roomId: z.string(),
  // ... other fields
});
```

## 🔧 Configuration

### Build Configuration
- **Vite Config**: Modern build tooling
- **TypeScript Config**: Strict type checking
- **Electron Builder**: Desktop app packaging
- **Tailwind Config**: Custom design system

### Environment Variables
- `VITE_FRONTDESK_SERVICE_URL`: Backend API URL
- `VITE_POSTHOG_KEY`: Analytics key (optional)

## 📱 Desktop App Features

### Electron Integration
- **Native Window Controls**: Minimize, maximize, close
- **Menu Bar**: Application menu and shortcuts
- **Auto-updater**: Automatic application updates
- **Offline Capability**: Limited offline functionality

### Performance Optimizations
- **Code Splitting**: Lazy-loaded routes
- **Memoization**: React.memo and useMemo
- **Virtual Scrolling**: Large data set handling
- **Caching**: API response caching

## 🐛 Troubleshooting

### Common Issues
1. **API Connection**: Check environment variables
2. **Permission Errors**: Verify user roles
3. **Build Failures**: Clear node_modules and reinstall
4. **Type Errors**: Update TypeScript definitions

### Development Tools
- **React DevTools**: Component debugging
- **Redux DevTools**: State inspection
- **Electron DevTools**: Desktop app debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow code standards
4. Write tests for new features
5. Submit a pull request

## 📄 License

This project is proprietary software developed for hotel management operations.

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Refer to the API documentation

---

**Built with ❤️ for modern hotel operations**
