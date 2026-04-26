import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  MapPin,
  Presentation,
  BookOpen,
  Wrench,
  Sparkles,
} from 'lucide-react';

import { AppHeader } from '../../components/AppHeader';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const activityTypes = [
  { value: 'all', label: 'Todas', icon: Presentation },
  { value: 'conferencia', label: 'Conferencias', icon: BookOpen },
  { value: 'taller', label: 'Talleres', icon: Wrench },
  { value: 'evento', label: 'Eventos', icon: Calendar },
  {
    value: 'actividad_especial',
    label: 'Especiales',
    icon: Sparkles,
  },
];

export const AttendeeProgramCalendar: React.FC = () => {
  const [selectedType, setSelectedType] = useState('all');

  // Abril 2026 como mes inicial
  const [currentMonth, setCurrentMonth] = useState(
    new Date(2026, 3, 1)
  );

  const loadActivities = useCallback(() => {
    return api.getCalendarActivities();
  }, []);

  const {
    data: activities = [],
    loading,
    error,
  } = useApi(loadActivities, []);

  const mappedActivities = useMemo(() => {
    return activities.map((activity: any) => {
      const parsedDate = new Date(activity.date);

      return {
        ...activity,
        day: parsedDate.getDate(),
        month: parsedDate.getMonth(),
        year: parsedDate.getFullYear(),
        type:
          activity.activityType
            ?.toLowerCase()
            ?.trim() || '',
      };
    });
  }, [activities]);

  const filteredActivities = useMemo(() => {
    let filtered = mappedActivities;

    if (selectedType !== 'all') {
      filtered = filtered.filter(
        (activity: any) =>
          activity.type === selectedType
      );
    }

    filtered = filtered.filter(
      (activity: any) =>
        activity.month === currentMonth.getMonth() &&
        activity.year === currentMonth.getFullYear()
    );

    return filtered;
  }, [
    mappedActivities,
    selectedType,
    currentMonth,
  ]);

  const daysInMonth = useMemo(() => {
    return new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();
  }, [currentMonth]);

  const monthName = useMemo(() => {
    return currentMonth.toLocaleDateString(
      'es-MX',
      {
        month: 'long',
        year: 'numeric',
      }
    );
  }, [currentMonth]);

  /*
    calendarDays:
    mini calendario lateral → SIEMPRE todos los días del mes

    activityDays:
    panel principal → SOLO días con actividades
  */

  const calendarDays = useMemo(() => {
    return Array.from(
      { length: daysInMonth },
      (_, i) => i + 1
    );
  }, [daysInMonth]);

  const activityDays = useMemo(() => {
    const uniqueDays = [
      ...new Set(
        filteredActivities.map(
          (activity: any) => activity.day
        )
      ),
    ].sort((a: number, b: number) => a - b);

    return uniqueDays;
  }, [filteredActivities]);

  const groupedActivities = useMemo(() => {
    return activityDays.map((day) => ({
      day,
      activities: filteredActivities.filter(
        (activity: any) =>
          activity.day === day
      ),
    }));
  }, [activityDays, filteredActivities]);

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  };

  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          <div className="space-y-6">
            <Card className="p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium capitalize">
                  {monthName}
                </h2>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPreviousMonth}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNextMonth}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-sm text-center">
                {calendarDays.map((day) => {
                  const hasEvent =
                    mappedActivities.some(
                      (activity: any) =>
                        activity.day === day &&
                        activity.month ===
                          currentMonth.getMonth() &&
                        activity.year ===
                          currentMonth.getFullYear()
                    );

                  return (
                    <div
                      key={day}
                      className={`h-9 rounded-lg flex items-center justify-center text-sm ${
                        hasEvent
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-600'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4" />
                <h3 className="font-medium">
                  Filtros
                </h3>
              </div>

              <div className="space-y-3">
                {activityTypes.map((type) => {
                  const Icon = type.icon;
                  const active =
                    selectedType === type.value;

                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        setSelectedType(
                          type.value
                        )
                      }
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition ${
                        active
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          <Card className="p-6 rounded-2xl overflow-hidden">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">
                Calendario de Actividades
              </h1>

              <p className="text-gray-500">
                Vista por días de actividades
              </p>
            </div>

            {loading && (
              <div className="p-10 text-center text-gray-600">
                Cargando calendario...
              </div>
            )}

            {error && (
              <div className="p-6 text-red-600">
                Error al cargar actividades
              </div>
            )}

            {!loading && !error && activityDays.length === 0 && (
              <div className="p-10 text-center text-gray-500">
                No hay actividades disponibles para este mes.
              </div>
            )}

            {!loading &&
              !error &&
              activityDays.length > 0 && (
                <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
                  {groupedActivities.map(
                    ({ day, activities }) => (
                      <div
                        key={day}
                        className="bg-gray-50 rounded-2xl border p-4"
                      >
                        <div className="mb-4 pb-3 border-b">
                          <p className="text-sm text-gray-500">
                            Día
                          </p>

                          <p className="text-2xl font-semibold text-gray-900">
                            {day}
                          </p>
                        </div>

                        <div className="space-y-4">
                          {activities.map(
                            (activity: any) => (
                                <Link
                                key={activity.id}
                                to={`/attendee/activities/${activity.id}`}
                                className="block rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
                                >
                                <h3 className="font-medium text-sm text-gray-900 mb-3">
                                  {activity.title}
                                </h3>

                                <div className="space-y-2 text-xs text-gray-500 mb-4">
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                      {activity.time}
                                      {activity.endTime
                                        ? ` - ${activity.endTime}`
                                        : ''}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-3 h-3" />
                                    <span>
                                      {activity.location}
                                    </span>
                                  </div>
                                </div>

                                <Badge>
                                  {activity.activityType}
                                </Badge>
                                </Link>
                            )
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AttendeeProgramCalendar;