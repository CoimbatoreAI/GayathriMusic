import { useState, useEffect } from 'react';
import {
    UserGroupIcon,
    MagnifyingGlassIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    CurrencyRupeeIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { apiClient } from '../../lib/api';

interface Student {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    enrolledCourses: any[];
    totalPaid: number;
    enrollmentStatus: string;
    paymentStatus: string;
    joiningDate: string;
}

export default function StudentManagement() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await apiClient.getStudents();
            if (response.success && Array.isArray(response.data)) {
                setStudents(response.data);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.phone.includes(searchTerm);

        const matchesStatus = filterStatus === 'all' || student.enrollmentStatus === filterStatus;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Student & Enrollment Management</h1>
                    <p className="text-gray-500">Track and manage student registrations and payments</p>
                </div>
                <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-lg">
                    <UserGroupIcon className="h-5 w-5 text-purple-600" />
                    <span className="font-bold text-purple-900">{students.length} Total Students</span>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-purple-50">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search students by name, email, or phone..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="block w-full md:w-48 py-2 px-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {student.firstName[0]}{student.lastName[0]}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{student.firstName} {student.lastName}</div>
                                                    <div className="text-xs text-gray-500 flex items-center">
                                                        <MapPinIcon className="h-3 w-3 mr-1" /> {student.city}, {student.state}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 flex items-center">
                                                <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" /> {student.email}
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                                <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" /> {student.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 font-medium whitespace-nowrap">
                                                {student.enrolledCourses?.[0]?.title || 'Standard Course'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${student.enrollmentStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    student.enrollmentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {student.enrollmentStatus === 'confirmed' ? <CheckCircleIcon className="w-3 h-3 mr-1" /> :
                                                    student.enrollmentStatus === 'pending' ? <ClockIcon className="w-3 h-3 mr-1" /> :
                                                        <XCircleIcon className="w-3 h-3 mr-1" />}
                                                {student.enrollmentStatus.charAt(0).toUpperCase() + student.enrollmentStatus.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-purple-600 flex items-center">
                                                <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
                                                {student.totalPaid?.toLocaleString() || '0'}
                                            </div>
                                            <div className={`text-[10px] font-bold uppercase mt-1 ${student.paymentStatus === 'completed' ? 'text-green-600' : 'text-orange-500'
                                                }`}>
                                                {student.paymentStatus}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <CalendarIcon className="h-4 w-4 mr-2" />
                                                {new Date(student.joiningDate).toLocaleDateString('en-IN')}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No students found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
