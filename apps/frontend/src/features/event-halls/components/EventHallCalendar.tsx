'use client';

import { Calendar, ChevronLeft, ChevronRight, Clock, Lock, Mail, Phone, Search, User } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ReservationStatus, type ReservationSummary } from '@/features/reservations/types';

interface Props {
  reservations: ReservationSummary[];
  isAdmin?: boolean;
}

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const WEEKDAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

export function EventHallCalendar({ reservations, isAdmin = false }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // Calendar calculations
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Adjust so Monday is 0, Sunday is 6
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Generate grid days
  const daysArray: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  // Group reservations of active month by day
  const getReservationsForDay = (day: number) => {
    const formattedDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return reservations.filter((res) => {
      const resDatePart = res.reservationDate.split('T')[0];
      return (
        resDatePart === formattedDayStr &&
        (res.status === ReservationStatus.PENDING ||
          res.status === ReservationStatus.CONFIRMED ||
          res.status === ReservationStatus.COMPLETED)
      );
    });
  };

  const activeDayReservations = selectedDay ? getReservationsForDay(selectedDay) : [];

  // Scroll to reservation and highlight for admin
  const handleScrollToReservation = (resId: string) => {
    const card = document.getElementById(`reservation-${resId}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Add visual glow/highlight class
      card.classList.add('ring-2', 'ring-primary', 'bg-primary/5', 'scale-[1.02]');

      // Remove it after 2 seconds
      setTimeout(() => {
        card.classList.remove('ring-2', 'ring-primary', 'bg-primary/5', 'scale-[1.02]');
      }, 2000);
    }
  };

  return (
    <Card className="border border-muted/80 p-5 shadow-md">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Calendar Grid Section */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-foreground text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <span>
                {MONTHS[month]} {year}
              </span>
            </h3>
            <div className="flex gap-1.5">
              <Button variant="outline" size="icon" onClick={handlePrevMonth} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 text-center font-medium text-muted-foreground text-xs">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square rounded-lg bg-muted/20" />;
              }

              const dayReservations = getReservationsForDay(day);
              const isOccupied = dayReservations.length > 0;
              const isSelected = selectedDay === day;

              let cellClass =
                'aspect-square flex flex-col items-center justify-between p-1.5 rounded-lg text-sm transition-all relative border cursor-pointer hover:bg-muted/40 ';

              if (isSelected) {
                cellClass += 'border-primary ring-2 ring-primary/20 bg-primary/5 font-semibold text-primary ';
              } else if (isOccupied) {
                cellClass +=
                  'border-amber-200/50 bg-amber-50/40 text-amber-900 dark:bg-amber-950/20 dark:text-amber-200 hover:border-amber-300 dark:hover:border-amber-800 ';
              } else {
                cellClass += 'border-transparent text-foreground ';
              }

              return (
                <button key={`day-${day}`} type="button" onClick={() => setSelectedDay(day)} className={cellClass}>
                  <span className="self-start text-xs">{day}</span>
                  {isOccupied && (
                    <span className="absolute right-1.5 bottom-1.5 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reservations Details Section */}
        <div className="flex min-h-[250px] w-full flex-col justify-between border-muted/80 border-t pt-5 lg:w-[350px] lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          <div>
            <h4 className="mb-3 font-semibold text-foreground text-sm">
              {selectedDay
                ? `Reservas para el ${selectedDay} de ${MONTHS[month]}`
                : 'Selecciona un día para ver la disponibilidad'}
            </h4>

            {selectedDay === null ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground text-xs">
                <Calendar className="mb-2 h-8 w-8 text-muted-foreground opacity-40" />
                <p>Haz clic en cualquier día del calendario para explorar horarios y disponibilidad.</p>
              </div>
            ) : activeDayReservations.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-6 py-12 text-center text-muted-foreground text-xs">
                <Clock className="mb-2 h-6 w-6 text-muted-foreground/45" />
                <p className="font-medium text-emerald-600 dark:text-emerald-400">Totalmente Disponible</p>
                <p className="mt-1">No hay reservas programadas para este día.</p>
              </div>
            ) : (
              <div className="max-h-[300px] space-y-3 overflow-y-auto pr-1">
                {activeDayReservations.map((res) => (
                  <button
                    key={res.id}
                    type="button"
                    className={`w-full text-left relative rounded-xl border p-3 text-xs transition-all ${
                      isAdmin
                        ? 'cursor-pointer border-muted bg-muted/30 hover:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary'
                        : 'border-amber-100 bg-amber-50/20 text-amber-900 dark:border-amber-950/40 dark:bg-amber-950/5 dark:text-amber-200'
                    }`}
                    onClick={() => isAdmin && handleScrollToReservation(res.id)}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {res.startTime} - {res.endTime}
                        </span>
                      </div>
                      <Badge variant="secondary" className="origin-right scale-90 px-1.5 py-0 text-[10px]">
                        {res.status}
                      </Badge>
                    </div>

                    {isAdmin ? (
                      <div className="mt-2 space-y-1.5 border-muted/50 border-t pt-2 text-muted-foreground">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <User className="h-3 w-3 text-primary" />
                          <span>{res.clientName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3" />
                          <span>{res.clientPhone || 'Sin teléfono'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{res.clientEmail}</span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-end gap-1 font-semibold text-[10px] text-primary hover:underline">
                          <Search className="h-2.5 w-2.5" />
                          <span>Click para ir a la reserva</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1.5 flex items-center gap-1.5 text-muted-foreground/80">
                        <Lock className="h-3 w-3" />
                        <span>Información de reserva bloqueada</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick status message */}
          {selectedDay !== null && activeDayReservations.length > 0 && (
            <p className="mt-3 text-[10px] text-muted-foreground italic">
              * Los horarios anteriores ya se encuentran reservados y confirmados.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
