import React from 'react';

export default function PrivacidadPage() {
  return (
    <div className="container-modern py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">
          Política de Privacidad
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-neutral-600 mb-6">
            Última actualización: {new Date().toLocaleDateString('es-CO')}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              1. Información que recopilamos
            </h2>
            <p className="text-neutral-600 mb-4">
              Recopilamos información que usted nos proporciona directamente, como cuando:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Se registra en nuestra plataforma</li>
              <li>Completa formularios en nuestro sitio web</li>
              <li>Se comunica con nosotros</li>
              <li>Participa en eventos o promociones</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              2. Cómo utilizamos su información
            </h2>
            <p className="text-neutral-600 mb-4">
              Utilizamos la información recopilada para:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Proporcionar y mantener nuestros servicios</li>
              <li>Comunicarnos con usted</li>
              <li>Mejorar nuestros servicios</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              3. Compartir información
            </h2>
            <p className="text-neutral-600 mb-4">
              No vendemos, alquilamos ni compartimos su información personal con terceros, excepto:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Con su consentimiento explícito</li>
              <li>Para cumplir con obligaciones legales</li>
              <li>Con proveedores de servicios que nos ayudan a operar</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              4. Seguridad
            </h2>
            <p className="text-neutral-600 mb-4">
              Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              5. Sus derechos
            </h2>
            <p className="text-neutral-600 mb-4">
              Usted tiene derecho a:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Acceder a su información personal</li>
              <li>Corregir información inexacta</li>
              <li>Solicitar la eliminación de su información</li>
              <li>Oponerse al procesamiento de su información</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              6. Contacto
            </h2>
            <p className="text-neutral-600 mb-4">
              Si tiene preguntas sobre esta política de privacidad, puede contactarnos en:
            </p>
            <p className="text-neutral-600">
              Email: elitecc.soporte@gmail.com<br />
              Teléfono: 322 5283206
            </p>
          </section>
        </div>
      </div>
    </div>
  );
} 