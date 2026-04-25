import React from 'react';
import { AppHeader } from '../../components/AppHeader';
import { mockConferences } from '../../data/mockConferences';
import { mockAttendees, mockAttendanceStats } from '../../data/mockData';
import { 
  TrendingUp,
  Users,
  Calendar,
  Award,
  BarChart3,
  PieChart
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export const AdminStats: React.FC = () => {
  // Calcular estadísticas
  const totalConferences = mockConferences.length;
  const totalAttendees = mockAttendees.length;
  const checkedInCount = mockAttendees.filter(a => a.checkedIn).length;
  const checkInRate = ((checkedInCount / totalAttendees) * 100).toFixed(1);

  // Datos para gráficas
  const conferenceTypeData = [
    {
      name: 'Presencial',
      value: mockConferences.filter((c) => c.type === 'presencial').length,
      color: '#3B82F6',
      indicatorClassName: 'bg-blue-500',
    },
    {
      name: 'Virtual',
      value: mockConferences.filter((c) => c.type === 'virtual').length,
      color: '#10B981',
      indicatorClassName: 'bg-green-500',
    },
    {
      name: 'Híbrida',
      value: mockConferences.filter((c) => c.type === 'híbrida').length,
      color: '#8B5CF6',
      indicatorClassName: 'bg-purple-500',
    },
  ];

  const attendanceByConference = mockConferences.slice(0, 5).map(conf => ({
    name: conf.title.substring(0, 20) + '...',
    registrados: conf.registeredCount,
    capacidad: conf.capacity,
    ocupación: ((conf.registeredCount / conf.capacity) * 100).toFixed(0)
  }));

  const trendData = mockAttendanceStats.map(stat => ({
    fecha: new Date(stat.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    registros: stat.registrations,
    checkIns: stat.checkIns
  }));

  const monthlyStats = [
    { mes: 'Ene', conferencias: 8, asistentes: 245 },
    { mes: 'Feb', conferencias: 12, asistentes: 380 },
    { mes: 'Mar', conferencias: 15, asistentes: 520 }
  ];

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
            Panel de Estadísticas
          </h1>
          <p className="text-lg text-gray-600">
            Análisis detallado del rendimiento de la plataforma
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl mb-1 text-gray-900">{totalConferences}</p>
            <p className="text-sm text-gray-600">Total Conferencias</p>
            <p className="text-xs text-green-600 mt-2">+25% vs mes anterior</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl mb-1 text-gray-900">{totalAttendees}</p>
            <p className="text-sm text-gray-600">Total Asistentes</p>
            <p className="text-xs text-green-600 mt-2">+42% vs mes anterior</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl mb-1 text-gray-900">6</p>
            <p className="text-sm text-gray-600">Conferencistas</p>
            <p className="text-xs text-green-600 mt-2">+2 nuevos este mes</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl mb-1 text-gray-900">{checkInRate}%</p>
            <p className="text-sm text-gray-600">Tasa de Check-in</p>
            <p className="text-xs text-green-600 mt-2">+5% vs promedio</p>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Trend Chart */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl text-gray-900">Tendencia de Registros</h2>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="fecha" 
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="registros" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Registros"
                  dot={{ fill: '#3B82F6', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="checkIns" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Check-ins"
                  dot={{ fill: '#10B981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Conference Type Distribution */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl text-gray-900">Distribución por Tipo</h2>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={conferenceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {conferenceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>

            <div className="mt-6 space-y-2">
              {conferenceTypeData.map((type) => (
                <div key={type.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${type.indicatorClassName}`} />
                    <span className="text-sm text-gray-700">{type.name}</span>
                  </div>
                  <span className="text-sm text-gray-900">{type.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Attendance by Conference */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h2 className="text-xl text-gray-900">Asistencia por Conferencia</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceByConference}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="registrados" fill="#3B82F6" name="Registrados" radius={[8, 8, 0, 0]} />
              <Bar dataKey="capacidad" fill="#E5E7EB" name="Capacidad" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly Overview */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl text-gray-900">Resumen Mensual</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="mes" 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="conferencias" fill="#8B5CF6" name="Conferencias" radius={[8, 8, 0, 0]} />
              <Bar dataKey="asistentes" fill="#F59E0B" name="Asistentes" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </main>
    </div>
  );
};

export default AdminStats;
