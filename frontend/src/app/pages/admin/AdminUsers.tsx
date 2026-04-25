import React, { useCallback, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  Edit,
  KeyRound,
  Plus,
  Search,
  Shield,
  UserCog,
  UserX,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { AppHeader } from '../../components/AppHeader';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import {
  CreateSystemUserPayload,
  SystemUser,
  UpdateSystemUserPayload,
  UserRole,
} from '../../types/conference.types';

const emptyCreateForm: CreateSystemUserPayload = {
  name: '',
  email: '',
  password: '',
  role: 'attendee',
};

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  speaker: 'Conferencista',
  attendee: 'Asistente',
};

const roleBadgeClasses: Record<UserRole, string> = {
  admin: 'bg-red-100 text-red-700',
  speaker: 'bg-purple-100 text-purple-700',
  attendee: 'bg-blue-100 text-blue-700',
};

export const AdminUsers: React.FC = () => {
  const loadUsers = useCallback(() => api.getUsers(), []);

  const {
    data: users,
    loading,
    error,
    refetch,
  } = useApi<SystemUser[]>(loadUsers, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'todos'>('todos');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] =
    useState<CreateSystemUserPayload>(emptyCreateForm);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [editForm, setEditForm] = useState<UpdateSystemUserPayload>({
    name: '',
    email: '',
    role: 'attendee',
  });
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch);

      const matchesRole = roleFilter === 'todos' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [roleFilter, searchQuery, users]);

  const stats = {
    total: users.length,
    active: users.filter((user) => user.isActive).length,
    inactive: users.filter((user) => !user.isActive).length,
    admins: users.filter((user) => user.role === 'admin').length,
    speakers: users.filter((user) => user.role === 'speaker').length,
    attendees: users.filter((user) => user.role === 'attendee').length,
  };

  const resetCreateForm = () => {
    setCreateForm(emptyCreateForm);
    setShowCreateForm(false);
  };

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();

    if (createForm.name.trim().length < 3) {
      toast.error('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (createForm.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setIsSaving(true);

      await api.createUser({
        name: createForm.name.trim(),
        email: createForm.email.trim().toLowerCase(),
        password: createForm.password,
        role: createForm.role,
      });

      toast.success('Usuario creado correctamente.');
      resetCreateForm();
      await refetch();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'No se pudo crear el usuario.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const openEditForm = (user: SystemUser) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleUpdateUser = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!editingUser) return;

    try {
      setIsSaving(true);

      await api.updateUser(editingUser.id, {
        name: editForm.name.trim(),
        email: editForm.email.trim().toLowerCase(),
        role: editForm.role,
      });

      toast.success('Usuario actualizado correctamente.');
      setEditingUser(null);
      await refetch();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar el usuario.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (user: SystemUser) => {
    try {
      await api.updateUserStatus(user.id, !user.isActive);

      toast.success(
        user.isActive
          ? 'Usuario desactivado correctamente.'
          : 'Usuario activado correctamente.'
      );

      await refetch();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'No se pudo cambiar el estado del usuario.'
      );
    }
  };

  const handleResetPassword = async (user: SystemUser) => {
    const confirmed = window.confirm(
      `¿Resetear contraseña de ${user.name}? Se generará una contraseña temporal.`
    );

    if (!confirmed) return;

    try {
      const response = await api.resetUserPassword(user.id);

      setTemporaryPassword(response.temporaryPassword);
      toast.success('Contraseña temporal generada.');
      await refetch();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'No se pudo resetear la contraseña.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl mb-2 text-gray-900">
              Gestión de Usuarios
            </h1>

            <p className="text-lg text-gray-600">
              Crea y administra cuentas reales de asistentes, conferencistas y
              administradores.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Nuevo usuario
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <StatCard label="Total" value={stats.total} icon={UserCog} />
          <StatCard label="Activos" value={stats.active} icon={CheckCircle} />
          <StatCard label="Inactivos" value={stats.inactive} icon={UserX} />
          <StatCard label="Admins" value={stats.admins} icon={Shield} />
          <StatCard label="Speakers" value={stats.speakers} icon={UserCog} />
          <StatCard label="Asistentes" value={stats.attendees} icon={UserCog} />
        </div>

        {temporaryPassword && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-5 mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg mb-1">
                Contraseña temporal generada
              </h2>

              <p className="text-sm mb-2">
                Compártela con el usuario por un canal seguro.
              </p>

              <code className="bg-white px-3 py-2 rounded border border-yellow-200 inline-block">
                {temporaryPassword}
              </code>
            </div>

            <button
              type="button"
              onClick={() => setTemporaryPassword(null)}
              className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
              aria-label="Cerrar aviso de contraseña temporal"
              title="Cerrar aviso"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value as UserRole | 'todos')
              }
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all bg-white"
              aria-label="Filtrar usuarios por rol"
              title="Filtrar usuarios por rol"
            >
              <option value="todos">Todos los roles</option>
              <option value="admin">Administradores</option>
              <option value="speaker">Conferencistas</option>
              <option value="attendee">Asistentes</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
            Cargando usuarios...
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-0.5" />

            <div>
              <h2 className="text-lg mb-1">No se pudieron cargar usuarios</h2>
              <p>{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-sm text-gray-700">
                      Creado
                    </th>
                    <th className="px-6 py-4 text-right text-sm text-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${roleBadgeClasses[user.role]}`}
                        >
                          {roleLabels[user.role]}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            user.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {user.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('es-MX')}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(user)}
                            className="p-2 text-blue-accent hover:bg-blue-light rounded-lg transition-colors"
                            aria-label={`Editar usuario ${user.name}`}
                            title="Editar usuario"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleResetPassword(user)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            aria-label={`Resetear contraseña de ${user.name}`}
                            title="Resetear contraseña"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.isActive
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            aria-label={
                              user.isActive
                                ? `Desactivar usuario ${user.name}`
                                : `Activar usuario ${user.name}`
                            }
                            title={
                              user.isActive
                                ? 'Desactivar usuario'
                                : 'Activar usuario'
                            }
                          >
                            {user.isActive ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No se encontraron usuarios.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showCreateForm && (
          <UserModal
            title="Crear nuevo usuario"
            onClose={resetCreateForm}
            onSubmit={handleCreateUser}
            isSaving={isSaving}
          >
            <UserFormFields
              name={createForm.name}
              email={createForm.email}
              password={createForm.password}
              role={createForm.role}
              includePassword
              onChange={(nextValues) =>
                setCreateForm({ ...createForm, ...nextValues })
              }
            />
          </UserModal>
        )}

        {editingUser && (
          <UserModal
            title="Editar usuario"
            onClose={() => setEditingUser(null)}
            onSubmit={handleUpdateUser}
            isSaving={isSaving}
          >
            <UserFormFields
              name={editForm.name}
              email={editForm.email}
              role={editForm.role}
              onChange={(nextValues) =>
                setEditForm({ ...editForm, ...nextValues })
              }
            />
          </UserModal>
        )}
      </main>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon }) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-3xl text-gray-900">{value}</p>
      </div>

      <div className="w-11 h-11 bg-blue-light rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-blue-accent" />
      </div>
    </div>
  </div>
);

interface UserModalProps {
  title: string;
  children: React.ReactNode;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

const UserModal: React.FC<UserModalProps> = ({
  title,
  children,
  isSaving,
  onClose,
  onSubmit,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <h2 className="text-2xl text-gray-900">{title}</h2>

        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Cerrar modal"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-5">
        {children}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-3 bg-gradient-to-r from-blue-gradient-start to-blue-gradient-end text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-60"
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

interface UserFormFieldsProps {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  includePassword?: boolean;
  onChange: (
    nextValues: Partial<CreateSystemUserPayload & UpdateSystemUserPayload>
  ) => void;
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({
  name,
  email,
  role,
  password = '',
  includePassword = false,
  onChange,
}) => (
  <>
    <div>
      <label className="block text-sm text-gray-700 mb-2">
        Nombre completo
      </label>

      <input
        type="text"
        required
        value={name}
        onChange={(event) => onChange({ name: event.target.value })}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all"
        placeholder="Nombre del usuario"
        autoComplete="name"
      />
    </div>

    <div>
      <label className="block text-sm text-gray-700 mb-2">
        Correo electrónico
      </label>

      <input
        type="email"
        required
        value={email}
        onChange={(event) => onChange({ email: event.target.value })}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all"
        placeholder="usuario@speakerzone.com"
        autoComplete="username"
      />
    </div>

    {includePassword && (
      <div>
        <label className="block text-sm text-gray-700 mb-2">
          Contraseña temporal
        </label>

        <input
          type="text"
          required
          minLength={6}
          value={password}
          onChange={(event) => onChange({ password: event.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all"
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
        />
      </div>
    )}

    <div>
      <label className="block text-sm text-gray-700 mb-2">
        Rol
      </label>

      <select
        required
        value={role}
        onChange={(event) => onChange({ role: event.target.value as UserRole })}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-accent focus:border-transparent outline-none transition-all bg-white"
        aria-label="Seleccionar rol del usuario"
      >
        <option value="attendee">Asistente</option>
        <option value="speaker">Conferencista</option>
        <option value="admin">Administrador</option>
      </select>

      <p className="text-xs text-gray-500 mt-2">
        El registro público solo crea asistentes. Los roles privilegiados se
        asignan desde esta pantalla administrativa.
      </p>
    </div>
  </>
);

export default AdminUsers;