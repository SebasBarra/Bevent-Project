import { ApiError } from '@/lib/api-client';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { title: string; detail: string; status: number } };

export async function safeAction<T>(action: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: {
          title: error.title,
          detail: error.detail,
          status: error.status,
        },
      };
    }

    if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('network'))) {
      return {
        success: false,
        error: {
          title: 'Error de Conexión',
          detail: 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.',
          status: 0,
        },
      };
    }

    return {
      success: false,
      error: {
        title: 'Error Inesperado',
        detail: 'Ocurrió un error inesperado al procesar tu solicitud.',
        status: 500,
      },
    };
  }
}
