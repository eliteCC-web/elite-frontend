import React from 'react';

export default function TerminosPage() {
  return (
    <div className="container-modern py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">
          Términos y Condiciones
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-neutral-600 mb-6">
            Última actualización: {new Date().toLocaleDateString('es-CO')}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              1. Aceptación de los términos
            </h2>
            <p className="text-neutral-600 mb-4">
              Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              2. Uso del servicio
            </h2>
            <p className="text-neutral-600 mb-4">
              Nuestro servicio está destinado únicamente para uso personal y comercial legítimo. Usted se compromete a:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>No utilizar el servicio para actividades ilegales</li>
              <li>No intentar acceder a áreas restringidas del sistema</li>
              <li>No interferir con el funcionamiento del servicio</li>
              <li>Proporcionar información precisa y actualizada</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              3. Cuentas de usuario
            </h2>
            <p className="text-neutral-600 mb-4">
              Al crear una cuenta, usted es responsable de:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Mantener la confidencialidad de su contraseña</li>
              <li>Todas las actividades que ocurran bajo su cuenta</li>
              <li>Notificar inmediatamente cualquier uso no autorizado</li>
              <li>Proporcionar información precisa y completa</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              4. Propiedad intelectual
            </h2>
            <p className="text-neutral-600 mb-4">
              Todo el contenido de este sitio web, incluyendo textos, gráficos, logotipos, imágenes y software, está protegido por derechos de autor y otras leyes de propiedad intelectual. No se permite la reproducción, distribución o modificación sin autorización previa.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              5. Limitación de responsabilidad
            </h2>
            <p className="text-neutral-600 mb-4">
              En ningún caso seremos responsables por daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar nuestro servicio.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              6. Modificaciones
            </h2>
            <p className="text-neutral-600 mb-4">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web. Su uso continuado del servicio constituye la aceptación de los nuevos términos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              7. Ley aplicable
            </h2>
            <p className="text-neutral-600 mb-4">
              Estos términos se rigen por las leyes de Colombia. Cualquier disputa será resuelta en los tribunales competentes de Santiago de Cali, Valle del Cauca.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
              8. Contacto
            </h2>
            <p className="text-neutral-600 mb-4">
              Si tiene preguntas sobre estos términos y condiciones, puede contactarnos en:
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