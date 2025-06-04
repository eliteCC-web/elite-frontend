import AuthService from './auth.service';
import { RegisterData } from '@/interfaces/auth.interface';

export interface UserGenerationConfig {
  colaboradores: number;
  clientesInternos: number;
  clientesExternos?: number;
}

export class UserGeneratorService {
  private firstNames = [
    'Ana', 'Carlos', 'María', 'José', 'Laura', 'Diego', 'Sofía', 'Miguel',
    'Carmen', 'David', 'Isabel', 'Roberto', 'Lucía', 'Andrés', 'Patricia',
    'Fernando', 'Elena', 'Ricardo', 'Mónica', 'Alejandro', 'Natalia', 'Javier',
    'Paola', 'Manuel', 'Sandra', 'Sergio', 'Adriana', 'Francisco', 'Valeria',
    'Héctor', 'Camila', 'Raúl', 'Daniela', 'Óscar', 'Andrea', 'Arturo',
    'Cristina', 'Guillermo', 'Beatriz', 'Emilio', 'Verónica', 'Ramón',
    'Claudia', 'Enrique', 'Gloria', 'Ignacio', 'Rosa', 'Joaquín', 'Pilar'
  ];

  private lastNames = [
    'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez',
    'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández',
    'Díaz', 'Moreno', 'Muñoz', 'Álvarez', 'Romero', 'Alonso', 'Gutiérrez',
    'Navarro', 'Torres', 'Domínguez', 'Vázquez', 'Ramos', 'Gil', 'Ramírez',
    'Serrano', 'Blanco', 'Suárez', 'Molina', 'Morales', 'Ortega', 'Delgado',
    'Castro', 'Ortiz', 'Rubio', 'Marín', 'Sanz', 'Iglesias', 'Medina',
    'Garrido', 'Cortés', 'Castillo', 'Santos', 'Lozano', 'Guerrero', 'Cano'
  ];

  // IDs de roles - estos deben coincidir con los IDs reales en la base de datos
  private roleIds = {
    COLABORADOR: 2,    // Ajustar según el ID real en la DB
    CLIENTE_INTERNO: 3, // Ajustar según el ID real en la DB
    CLIENTE_EXTERNO: 4  // Ajustar según el ID real en la DB
  };

  /**
   * Genera usuarios automáticamente según la configuración proporcionada
   */
  async generateUsers(config: UserGenerationConfig): Promise<{
    success: boolean;
    results: any;
    message: string;
  }> {
    try {
      const allUsers: RegisterData[] = [];

      // Generar colaboradores
      if (config.colaboradores > 0) {
        const colaboradores = this.generateUsersOfType('colaborador', config.colaboradores, this.roleIds.COLABORADOR);
        allUsers.push(...colaboradores);
      }

      // Generar clientes internos
      if (config.clientesInternos > 0) {
        const clientesInternos = this.generateUsersOfType('cliente.interno', config.clientesInternos, this.roleIds.CLIENTE_INTERNO);
        allUsers.push(...clientesInternos);
      }

      // Generar clientes externos (opcional)
      if (config.clientesExternos && config.clientesExternos > 0) {
        const clientesExternos = this.generateUsersOfType('cliente.externo', config.clientesExternos, this.roleIds.CLIENTE_EXTERNO);
        allUsers.push(...clientesExternos);
      }

      // Enviar usuarios al backend en lotes para evitar sobrecarga
      const batchSize = 25;
      let totalCreated = 0;
      let totalErrors = 0;
      const allErrors: any[] = [];

      for (let i = 0; i < allUsers.length; i += batchSize) {
        const batch = allUsers.slice(i, i + batchSize);
        
        try {
          const result = await AuthService.createBulkUsers(batch);
          totalCreated += result.created;
          totalErrors += result.errors.length;
          allErrors.push(...result.errors);
          
          // Mostrar progreso
          console.log(`Procesado lote ${Math.ceil((i + batchSize) / batchSize)} de ${Math.ceil(allUsers.length / batchSize)}`);
          
          // Pausa pequeña para no saturar el servidor
          await this.delay(500);
        } catch (error) {
          console.error('Error procesando lote:', error);
          totalErrors += batch.length;
        }
      }

      return {
        success: true,
        results: {
          totalUsers: allUsers.length,
          created: totalCreated,
          errors: totalErrors,
          errorDetails: allErrors
        },
        message: `Proceso completado. ${totalCreated} usuarios creados, ${totalErrors} errores.`
      };

    } catch (error) {
      console.error('Error generando usuarios:', error);
      return {
        success: false,
        results: null,
        message: 'Error al generar usuarios: ' + error
      };
    }
  }

  /**
   * Genera usuarios de un tipo específico
   */
  private generateUsersOfType(userType: string, count: number, roleId: number): RegisterData[] {
    const users: RegisterData[] = [];

    for (let i = 1; i <= count; i++) {
      const firstName = this.getRandomName(this.firstNames, i);
      const lastName = this.getRandomName(this.lastNames, i);
      
      users.push({
        firstName,
        lastName,
        email: `${userType}${i}@elitecc.com`,
        password: 'Elite123', // Contraseña por defecto
        phone: this.generatePhone(i),
        roleIds: [roleId]
      });
    }

    return users;
  }

  /**
   * Obtiene un nombre aleatorio basado en el índice
   */
  private getRandomName(nameArray: string[], index: number): string {
    return nameArray[(index - 1) % nameArray.length];
  }

  /**
   * Genera un número de teléfono único
   */
  private generatePhone(index: number): string {
    const prefix = 300 + (index % 10);
    const suffix = String(1000000 + index).substring(1);
    return `${prefix}${suffix}`;
  }

  /**
   * Función de utilidad para pausas
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Genera usuarios con configuración predeterminada
   */
  async generateDefaultUsers(): Promise<any> {
    const defaultConfig: UserGenerationConfig = {
      colaboradores: 75,
      clientesInternos: 75,
      clientesExternos: 25
    };

    return this.generateUsers(defaultConfig);
  }
}

export default new UserGeneratorService();