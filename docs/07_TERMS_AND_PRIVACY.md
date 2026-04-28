# 07 — Términos de Servicio y Política de Privacidad
## TaxLens PY

> **Versión 1.0 — Vigente desde el lanzamiento público**  
> Última actualización: [fecha de publicación]

---

> ⚠️ **NOTA PARA EL DESARROLLADOR ANTES DE PUBLICAR**
> Este documento es una base técnica-legal preparada con investigación real sobre el marco normativo paraguayo e internacional. **No constituye asesoramiento legal**. Antes del lanzamiento público, debe ser revisado y firmado por un abogado habilitado en Paraguay, preferentemente con experiencia en derecho digital y tecnología. Costo estimado de revisión: ₲ 500.000 – 1.500.000 (sesión única). Las cláusulas escritas en MAYÚSCULAS son estándar internacional de alta visibilidad para limitaciones de responsabilidad.

---

## Marco Legal Aplicable

Este documento se rige por las siguientes normas, en orden de jerarquía:

**Normativa paraguaya:**
- **Constitución Nacional del Paraguay** — Art. 33 (Derecho a la Intimidad), Art. 135 (Habeas Data)
- **Ley N° 7593/2025** — De Protección de Datos Personales en la República del Paraguay (promulgada el 27 de noviembre de 2025; plena exigibilidad a partir de noviembre de 2027, con período de adecuación en curso)
- **Ley N° 4868/2013** — De Comercio Electrónico y sus reglamentaciones
- **Ley N° 6534/2020** — De Protección de Datos de Crédito (aplicable a datos crediticios, vigente junto a Ley 7593)
- **Código Civil Paraguayo** — Normativa general de contratos y responsabilidad civil

**Estándares internacionales de referencia (no vinculantes, usados como guía de buenas prácticas):**
- **RGPD / GDPR** — Reglamento (UE) 2016/679 (referencia de mejores prácticas; la Ley 7593/2025 está inspirada en él)
- **ISO/IEC 27001:2022** — Gestión de seguridad de la información
- **ISO/IEC 27701:2025** — Sistema de Gestión de Información de Privacidad (PIMS)
- **ISO/IEC 29100:2011** — Marco de privacidad para sistemas de tecnología de la información
- **Principios de la OCDE sobre privacidad** (revisados 2013)
- **Convención 108+ del Consejo de Europa** — Marco de referencia para protección de datos

**Autoridad de aplicación en Paraguay:**
- **Agencia Nacional de Protección de Datos Personales (ANPDP)** — creada bajo la Ley 7593/2025, bajo la órbita del Ministerio de Tecnologías de la Información y Comunicación (MITIC)

---

## Parte I — Términos de Servicio

### Artículo 1. Aceptación de los Términos

1.1 Al registrarse, acceder o utilizar TaxLens PY (en adelante, "el Servicio"), el usuario declara haber leído, comprendido y aceptado en su totalidad los presentes Términos de Servicio ("ToS") y la Política de Privacidad integrada en este documento.

1.2 La aceptación se perfecciona mediante cualquiera de los siguientes actos: creación de una cuenta, clic en el botón "Acepto los términos", uso del Servicio, o descarga de cualquier componente de la plataforma.

1.3 Si el usuario no acepta estos términos, debe abstenerse de utilizar el Servicio. El uso continuado implica aceptación plena e irrevocable de las condiciones vigentes.

1.4 De conformidad con la **Ley N° 4868/2013 de Comercio Electrónico**, esta aceptación electrónica tiene plena validez jurídica y equivale a una firma manuscrita.

---

### Artículo 2. Descripción del Servicio

2.1 TaxLens PY es una herramienta de software que **asiste** al usuario en el procesamiento de imágenes de documentos fiscales (facturas, recibos) mediante tecnologías de reconocimiento óptico de caracteres (OCR) e inteligencia artificial (IA) que se ejecutan **íntegramente en el dispositivo del usuario**.

2.2 El Servicio genera archivos en formato CSV y/o Excel que el usuario puede utilizar como referencia para preparar sus declaraciones en el sistema Marangatu de la Dirección Nacional de Ingresos Tributarios (DNIT). **El Servicio no presenta declaraciones ante la DNIT ni actúa como representante fiscal del usuario.**

2.3 El Servicio proporciona acceso a una base de conocimiento sobre legislación tributaria paraguaya con fines informativos y de orientación. **Esta información no constituye asesoramiento legal ni contable.**

2.4 El Servicio opera en dos modalidades: una gratuita ("Free") y una de suscripción mensual ("AI Playground"), según se detalla en el Artículo 8.

---

### Artículo 3. Naturaleza Local-First del Servicio y Distribución de Responsabilidades

**Este artículo es fundamental. El usuario debe leerlo detenidamente.**

3.1 **Procesamiento exclusivamente local:** Todo el procesamiento de imágenes de documentos fiscales, la extracción de texto mediante OCR, la clasificación de datos mediante modelos de IA, y la generación de archivos de exportación se ejecuta íntegramente en el dispositivo (computadora, tablet o smartphone) del usuario, mediante tecnologías de navegador web (WebGPU, WASM, OPFS, IndexedDB). Ningún documento fiscal, imagen de factura, dato extraído, RUC, monto u otra información de naturaleza tributaria es transmitida a servidores de TaxLens PY.

3.2 **El usuario es el único responsable de sus datos:** Dado que todos los datos fiscales residen y son procesados exclusivamente en el dispositivo del usuario, TaxLens PY no tiene acceso, visibilidad ni control sobre dichos datos. Por tanto, el usuario asume plena y exclusiva responsabilidad por:
   - La custodia y seguridad de los datos almacenados en su dispositivo
   - La exactitud de los archivos generados
   - La verificación del contenido extraído por OCR antes de su uso
   - La presentación correcta de declaraciones ante la DNIT
   - Cualquier consecuencia fiscal, contable, administrativa o legal derivada del uso de los archivos generados

3.3 **El Servicio es una herramienta de asistencia, no un servicio profesional:** TaxLens PY no es un servicio de asesoramiento contable, fiscal, legal o financiero. Los archivos generados son un punto de partida que el usuario debe verificar, corregir y validar antes de cualquier uso oficial. El usuario que presenta una declaración ante la DNIT utilizando datos generados por esta herramienta lo hace bajo su propia responsabilidad y criterio profesional.

3.4 **Limitaciones inherentes de las tecnologías de IA y OCR:** El usuario reconoce y acepta que:
   - Los sistemas de OCR pueden cometer errores de reconocimiento, especialmente en documentos de baja calidad, imágenes borrosas o fotografías con mala iluminación
   - Los modelos de IA pueden generar clasificaciones incorrectas
   - Ningún sistema automatizado de procesamiento de documentos garantiza precisión del 100%
   - Es responsabilidad exclusiva del usuario revisar y corregir los resultados antes de utilizarlos

---

### Artículo 4. LIMITACIÓN DE RESPONSABILIDAD

> *Esta sección contiene las limitaciones de responsabilidad más importantes del contrato. El usuario debe leerla en su totalidad.*

4.1 **EXCLUSIÓN TOTAL DE GARANTÍAS:** EL SERVICIO SE PROPORCIONA "TAL CUAL" ("AS IS") Y "SEGÚN DISPONIBILIDAD" ("AS AVAILABLE"), SIN GARANTÍAS DE NINGÚN TIPO, EXPRESAS O IMPLÍCITAS, INCLUYENDO PERO NO LIMITADO A: GARANTÍAS DE COMERCIABILIDAD, IDONEIDAD PARA UN FIN PARTICULAR, EXACTITUD, COMPLETITUD, CONFIABILIDAD O NO INFRACCIÓN. TAXLENS PY NO GARANTIZA QUE EL SERVICIO ESTÉ LIBRE DE ERRORES, INTERRUPCIONES, VIRUS U OTROS COMPONENTES DAÑINOS.

4.2 **EXCLUSIÓN DE RESPONSABILIDAD POR ERRORES DE OCR:** TAXLENS PY NO SERÁ RESPONSABLE, BAJO NINGUNA CIRCUNSTANCIA, POR ERRORES, OMISIONES O INEXACTITUDES EN LOS DATOS EXTRAÍDOS MEDIANTE RECONOCIMIENTO ÓPTICO DE CARACTERES (OCR) DE IMÁGENES DE DOCUMENTOS. EL RESULTADO DEL OCR ES UNA APROXIMACIÓN AUTOMATIZADA QUE REQUIERE VERIFICACIÓN MANUAL OBLIGATORIA POR PARTE DEL USUARIO.

4.3 **EXCLUSIÓN DE RESPONSABILIDAD POR ARCHIVOS GENERADOS:** TAXLENS PY NO SERÁ RESPONSABLE POR EL CONTENIDO DE LOS ARCHIVOS CSV O EXCEL GENERADOS POR EL SERVICIO, NI POR LAS CONSECUENCIAS DE SU USO EN DECLARACIONES TRIBUTARIAS ANTE LA DNIT O CUALQUIER OTRA AUTORIDAD FISCAL. EL USUARIO DECLARA SER EL ÚNICO RESPONSABLE DE VERIFICAR, CORREGIR Y VALIDAR DICHOS ARCHIVOS ANTES DE SU USO OFICIAL.

4.4 **EXCLUSIÓN DE RESPONSABILIDAD POR SANCIONES FISCALES:** TAXLENS PY NO ASUME RESPONSABILIDAD ALGUNA POR MULTAS, SANCIONES, INTERESES, RECARGOS, IMPUGNACIONES O CUALQUIER CONSECUENCIA ADMINISTRATIVA O LEGAL DERIVADA DE ERRORES EN DECLARACIONES TRIBUTARIAS PREPARADAS CON ASISTENCIA DE ESTE SERVICIO.

4.5 **EXCLUSIÓN POR CAMBIOS REGULATORIOS:** TAXLENS PY NO GARANTIZA QUE LA BASE DE CONOCIMIENTO DE LEGISLACIÓN DNIT ESTÉ ACTUALIZADA EN TIEMPO REAL. LAS RESOLUCIONES, CIRCULARES Y MODIFICACIONES NORMATIVAS DE LA DNIT SON RESPONSABILIDAD DEL USUARIO VERIFICAR EN LAS FUENTES OFICIALES (DNIT.GOV.PY, BACN.GOV.PY).

4.6 **TOPE MÁXIMO DE RESPONSABILIDAD:** EN NINGÚN CASO LA RESPONSABILIDAD TOTAL ACUMULADA DE TAXLENS PY HACIA EL USUARIO SUPERARÁ EL MONTO TOTAL ABONADO POR EL USUARIO AL SERVICIO EN LOS ÚLTIMOS TRES (3) MESES PREVIOS AL EVENTO QUE DIO LUGAR AL RECLAMO. PARA USUARIOS DEL PLAN GRATUITO, EL TOPE MÁXIMO ES DE CERO GUARANÍES (₲ 0).

4.7 **EXCLUSIÓN DE DAÑOS INDIRECTOS:** TAXLENS PY NO SERÁ RESPONSABLE POR DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENTES O PUNITIVOS, INCLUYENDO PERO NO LIMITADO A: PÉRDIDA DE GANANCIAS, PÉRDIDA DE DATOS, PÉRDIDA DE OPORTUNIDADES COMERCIALES, DAÑO REPUTACIONAL O CUALQUIER OTRA PÉRDIDA INTANGIBLE, AUN CUANDO TAXLENS PY HAYA SIDO ADVERTIDO DE LA POSIBILIDAD DE TALES DAÑOS.

4.8 **Alcance de las exclusiones:** Las limitaciones de este artículo se aplican independientemente de la teoría legal invocada (contrato, agravio, responsabilidad objetiva u otra) y subsisten incluso si cualquier remedio previsto en este contrato no cumple su propósito esencial.

---

### Artículo 5. Obligaciones del Usuario

5.1 El usuario se compromete a:
   - Utilizar el Servicio de conformidad con la legislación vigente en Paraguay y en su jurisdicción
   - No intentar descompilar, hacer ingeniería inversa o extraer los modelos de IA distribuidos por el Servicio
   - No utilizar el Servicio para procesar documentos de terceros sin autorización de dichos terceros
   - Mantener la confidencialidad de sus credenciales de acceso
   - Notificar inmediatamente a TaxLens PY ante cualquier uso no autorizado de su cuenta

5.2 **Uso profesional:** El usuario que utiliza el Servicio en ejercicio de una actividad profesional (contador, administrador de empresas, asesor fiscal) asume responsabilidad profesional íntegra por el uso que haga de los resultados. TaxLens PY no reemplaza el criterio, la verificación ni la firma profesional del contador habilitado.

5.3 El usuario acepta que la verificación manual de todos los campos extraídos por OCR no es opcional, sino **un paso obligatorio e inherente al uso correcto del Servicio**.

---

### Artículo 6. Propiedad Intelectual

6.1 TaxLens PY, incluyendo su código fuente, diseño, interfaz, marca, logotipos y documentación, es propiedad exclusiva del desarrollador y está protegido por la legislación de propiedad intelectual aplicable.

6.2 Los modelos de IA distribuidos a través del AI Hub son propiedad de sus respectivos desarrolladores originales (Google, Microsoft) y se distribuyen bajo sus licencias de código abierto correspondientes. TaxLens PY no reclama propiedad sobre dichos modelos.

6.3 El usuario retiene todos los derechos sobre los documentos que procesa y los datos que genera. TaxLens PY no adquiere ningún derecho sobre dicho contenido.

6.4 Los esquemas, plantillas y reglas creadas por el usuario en el AI Playground son de su exclusiva propiedad. La sincronización en la nube de dichas configuraciones implica únicamente un almacenamiento técnico, no una cesión de derechos.

---

### Artículo 7. Vigencia, Modificaciones y Terminación

7.1 Estos ToS entran en vigor en el momento del registro del usuario y permanecen vigentes hasta la cancelación de la cuenta.

7.2 TaxLens PY se reserva el derecho de modificar estos ToS en cualquier momento. Las modificaciones se notificarán al usuario mediante correo electrónico o aviso prominente en la aplicación con un mínimo de 15 días de antelación. El uso continuado del Servicio después de dicho período implica aceptación de los nuevos términos.

7.3 El usuario puede cancelar su cuenta en cualquier momento desde la configuración de la aplicación. La cancelación de la cuenta del plan gratuito es inmediata. La cancelación del AI Playground surte efecto al final del período de suscripción en curso, sin reembolso de la porción no utilizada.

7.4 TaxLens PY puede suspender o cancelar el acceso de un usuario que viole estos ToS, previo aviso salvo en casos de violaciones graves o actividad ilegal.

---

### Artículo 8. Planes, Precios y Pagos

8.1 **Plan Free:** Acceso gratuito y permanente a las funcionalidades base del Servicio (AI Hub, Marangatu Generator, consulta de legislación DNIT). Sin límite de tiempo ni de uso.

8.2 **AI Playground:** Suscripción mensual de ₲ 50.000 (cincuenta mil guaraníes) con acceso al Schema Builder, Logic Engine, Template Generator y base de conocimiento personalizada. Se ofrece un período de prueba de 7 días sin cargo.

8.3 Los precios están expresados en guaraníes paraguayos (₲). TaxLens PY se reserva el derecho de modificar los precios con notificación previa de 30 días.

8.4 Los pagos se procesarán mediante los métodos habilitados en cada momento (transferencia bancaria, Bancard u otros). Las transacciones están sujetas a los términos del procesador de pago correspondiente.

8.5 TaxLens PY no almacena datos de tarjetas de crédito ni información bancaria del usuario. Dichos datos son gestionados exclusivamente por el procesador de pagos contratado.

---

### Artículo 9. Resolución de Disputas y Jurisdicción

9.1 Cualquier controversia derivada de estos ToS se someterá preferentemente a negociación directa entre las partes.

9.2 De no llegarse a un acuerdo, las partes se someten a la jurisdicción de los Tribunales de la ciudad de Asunción, República del Paraguay, con renuncia expresa a cualquier otro fuero o jurisdicción.

9.3 Estos ToS se rigen e interpretan exclusivamente conforme al derecho paraguayo.

---

## Parte II — Política de Privacidad

### Artículo 10. Responsable del Tratamiento de Datos

El responsable del tratamiento de los datos personales que se recopilan a través de TaxLens PY es:

- **Denominación:** TaxLens PY (proyecto independiente)
- **Titular:** [Nombre del desarrollador]
- **Contacto de privacidad:** [email de contacto para solicitudes ARCO]
- **Domicilio:** [dirección, Paraguay]

De conformidad con la **Ley N° 7593/2025**, el titular es responsable del tratamiento de los datos mínimos de sesión descritos en este documento y garantiza el cumplimiento de los principios de licitud, lealtad, transparencia, finalidad, minimización, exactitud, seguridad y responsabilidad proactiva.

---

### Artículo 11. Principio Fundamental: Privacidad desde el Diseño

11.1 TaxLens PY ha sido diseñado aplicando el principio de **Privacy by Design** (privacidad desde el diseño), reconocido internacionalmente por el **ISO/IEC 27701:2025** y adoptado como principio rector en el RGPD europeo y en la **Ley N° 7593/2025** de Paraguay.

11.2 La arquitectura técnica del Servicio implementa este principio de forma estructural: los datos fiscales del usuario **nunca abandonan su dispositivo**. No es una política que puede cambiar con una actualización; es una imposibilidad técnica por diseño.

11.3 Principio de **minimización de datos** (Art. 5 RGPD; reconocido en Ley 7593/2025): TaxLens PY recopila únicamente los datos estrictamente necesarios para proveer el Servicio y gestionar la relación contractual, sin recopilar nada adicional.

---

### Artículo 12. Qué Datos Recopilamos y Por Qué

#### 12.1 Datos recopilados en la nube (servidor de TaxLens PY — Neon PostgreSQL):

| Dato | Finalidad | Base legal |
|------|-----------|------------|
| Dirección de correo electrónico | Identificación de cuenta, comunicaciones del servicio | Ejecución del contrato (Art. 7.b Ley 7593/2025) |
| Nombre o alias (opcional) | Personalización de la interfaz | Consentimiento del usuario |
| Plan de suscripción y estado | Gestión del acceso a funcionalidades | Ejecución del contrato |
| Fecha de registro y último acceso | Seguridad, detección de accesos no autorizados | Interés legítimo del responsable |
| Referencia de pago (token, no datos de tarjeta) | Verificación de pagos | Ejecución del contrato |
| Esquemas y plantillas del AI Playground (configuraciones) | Sincronización multi-dispositivo | Consentimiento del usuario (funcionalidad opt-in) |

#### 12.2 Datos que NUNCA recopilamos en nuestros servidores:

- ❌ Imágenes de facturas o documentos fiscales
- ❌ Texto extraído de facturas por OCR
- ❌ RUCs de emisores o receptores
- ❌ Montos, timbrados o números de factura
- ❌ Clasificaciones fiscales (IVA, IRE, IRP-RSP) de transacciones individuales
- ❌ Documentos subidos por el usuario a la base de conocimiento personalizada
- ❌ Datos de tarjetas de crédito o información bancaria
- ❌ Historial de procesamiento de facturas

#### 12.3 Datos procesados exclusivamente en el dispositivo del usuario (NUNCA salen de su equipo):

Todos los datos fiscales, documentos, resultados de OCR, clasificaciones de IA y archivos generados son procesados y almacenados exclusivamente en el navegador web del usuario mediante:
- **OPFS (Origin Private File System):** modelos de IA, índices vectoriales, documentos propios
- **IndexedDB:** historial de facturas procesadas, configuraciones locales
- Estos almacenamientos están aislados por origen (dominio) y no son accesibles para TaxLens PY ni para ningún tercero

---

### Artículo 13. Derechos ARCO del Usuario

De conformidad con la **Ley N° 7593/2025** (Arts. relativos a derechos de los titulares) y en consonancia con el **RGPD** europeo, el usuario tiene los siguientes derechos sobre sus datos personales:

- **Acceso:** Derecho a conocer qué datos personales tenemos sobre usted, con qué finalidad y por cuánto tiempo
- **Rectificación:** Derecho a corregir datos inexactos o incompletos
- **Cancelación/Supresión:** Derecho a solicitar la eliminación de sus datos cuando ya no sean necesarios o cuando retire su consentimiento
- **Oposición:** Derecho a oponerse al tratamiento de sus datos para finalidades específicas
- **Portabilidad:** Derecho a recibir sus datos en formato estructurado y transferirlos (en cumplimiento del estándar ISO/IEC 27701:2025)
- **No ser objeto de decisiones automatizadas:** Conforme a la Ley 7593/2025, el usuario tiene derecho a no ser sometido a decisiones con efectos jurídicos basadas únicamente en procesamiento automatizado

Para ejercer cualquiera de estos derechos, el usuario debe enviar una solicitud a: **[email de privacidad]**. TaxLens PY responderá en un plazo máximo de 30 días hábiles.

---

### Artículo 14. Plazo de Conservación de Datos

Los datos mínimos de cuenta se conservan durante el tiempo que la cuenta esté activa más un período de 6 meses post-cancelación (para atender reclamaciones sobre períodos facturados). Transcurrido ese período, los datos se eliminan permanentemente de los servidores.

Los esquemas y plantillas del AI Playground se eliminan inmediatamente al cancelar la cuenta, salvo solicitud expresa del usuario de exportarlos antes de la cancelación.

---

### Artículo 15. Seguridad de los Datos

15.1 TaxLens PY implementa medidas técnicas y organizativas de seguridad alineadas con las recomendaciones del **ISO/IEC 27001:2022** para los datos mínimos que gestiona en la nube:
   - Comunicaciones cifradas mediante TLS 1.3
   - Contraseñas nunca almacenadas (gestión de identidad delegada a Kinde Auth, proveedor con certificación SOC 2)
   - Base de datos con acceso restringido y logs de auditoría
   - Tokens JWT con expiración y rotación

15.2 Dado que los datos fiscales residen exclusivamente en el dispositivo del usuario, la seguridad de dichos datos depende de las medidas de seguridad del propio dispositivo del usuario (contraseña, cifrado de disco, bloqueo de pantalla).

15.3 En caso de incidente de seguridad que afecte los datos mínimos que TaxLens PY gestiona en la nube, el usuario será notificado dentro de las 72 horas siguientes a la detección, conforme a lo establecido en la **Ley N° 7593/2025** y las mejores prácticas del **ISO/IEC 27701:2025**.

---

### Artículo 16. Transferencia Internacional de Datos

16.1 Los datos mínimos de cuenta se almacenan en infraestructura de **Neon Inc.** (PostgreSQL serverless), cuya infraestructura se ubica principalmente en Estados Unidos, y en **Vercel Inc.** para los servicios de hosting y autenticación.

16.2 De conformidad con la **Ley N° 7593/2025, Art.** relativo a transferencias internacionales, y el Art. 46 del **RGPD** (utilizado como referencia de buenas prácticas), TaxLens PY solo trabaja con proveedores de infraestructura que ofrecen garantías contractuales de protección de datos (Standard Contractual Clauses o equivalentes) y que cuentan con certificaciones de seguridad reconocidas.

16.3 Los proveedores actuales y sus certificaciones relevantes son:
   - **Vercel Inc.** — SOC 2 Type II, GDPR-compliant
   - **Neon Inc.** — SOC 2 Type II, cifrado en reposo y en tránsito
   - **Kinde Auth** — SOC 2 Type II, proveedores de identidad certificados

16.4 Bajo ninguna circunstancia TaxLens PY vende, alquila o cede los datos personales del usuario a terceros con fines comerciales.

---

### Artículo 17. Cookies y Tecnologías de Seguimiento

17.1 TaxLens PY utiliza cookies estrictamente necesarias para la autenticación (tokens de sesión JWT). No se utilizan cookies de seguimiento, publicidad ni analítica de terceros que compartan datos con terceros.

17.2 Para analítica de uso interno, TaxLens PY puede implementar **Plausible Analytics**, una solución de analítica web que no utiliza cookies, no comparte datos con terceros y es compatible con el **RGPD** y la **Ley 7593/2025** por su principio de mínima recolección de datos.

17.3 El usuario puede consultar y gestionar las cookies almacenadas desde la configuración de su navegador.

---

### Artículo 18. Consentimiento Informado y Base Legal

De conformidad con la **Ley N° 7593/2025** y el principio de consentimiento libre, previo, expreso e informado:

- El usuario presta consentimiento al registrarse y aceptar estos ToS
- El consentimiento para la sincronización de esquemas en la nube (AI Playground) es independiente y puede revocarse eliminando los esquemas desde la configuración
- El usuario puede retirar su consentimiento en cualquier momento cancelando su cuenta, sin que ello afecte la licitud del tratamiento previo

---

### Artículo 19. Limitación de Responsabilidad en Materia de Privacidad

19.1 Dado que TaxLens PY **no almacena ni tiene acceso a datos fiscales del usuario**, no puede ser considerado responsable de brechas de seguridad que afecten datos que exclusivamente residen en el dispositivo del usuario.

19.2 En el caso improbable de una brecha de seguridad que afecte los datos mínimos de cuenta (email, plan, esquemas de configuración), TaxLens PY adoptará las medidas de notificación y mitigación descritas en el Artículo 15.3.

19.3 TaxLens PY no es responsable por la seguridad de los datos procesados en el dispositivo del usuario, incluyendo pérdidas de datos por fallas de hardware, eliminación accidental de archivos del navegador, o acceso físico no autorizado al dispositivo.

---

### Artículo 20. Contacto y Autoridad de Control

**Para consultas, solicitudes ARCO o reclamaciones:**
- Email: [email@taxlens.com.py]
- Respuesta garantizada en: 30 días hábiles

**Autoridad de control en Paraguay:**
- **Agencia Nacional de Protección de Datos Personales (ANPDP)**
- Ministerio de Tecnologías de la Información y Comunicación (MITIC)
- Web: [cuando esté disponible]

El usuario tiene derecho a presentar una reclamación ante la ANPDP si considera que el tratamiento de sus datos personales no se ajusta a la **Ley N° 7593/2025**, sin perjuicio de los recursos judiciales disponibles.

---

## Resumen Visual para el Usuario

> *Esta sección es un resumen informativo, no tiene valor legal. El texto vinculante es el de las cláusulas anteriores.*

| Pregunta del usuario | Respuesta concreta |
|---|---|
| ¿Mis facturas van a servidores de TaxLens PY? | **No. Nunca.** Se procesan solo en tu computadora. |
| ¿Qué datos sí guarda TaxLens PY? | Solo tu email, plan de suscripción y configuraciones del Playground. |
| ¿TaxLens PY puede ver mis RUCs o montos? | **No.** Técnicamente es imposible. Los datos están en tu navegador. |
| ¿Si el OCR se equivoca, TaxLens PY me compensa? | No. Sos responsable de revisar y verificar los resultados. |
| ¿Si la declaración en Marangatu sale mal, TaxLens PY responde? | No. La presentación de declaraciones es responsabilidad exclusiva tuya. |
| ¿Puedo pedir que borren mis datos? | Sí. Cancela tu cuenta o escribe a [email]. |
| ¿Comparten mis datos con terceros? | **No.** Nunca se venden ni comparten con fines comerciales. |
| ¿Qué ley protege mis datos en Paraguay? | Constitución (Art. 33 y 135) + Ley 7593/2025 + Ley 4868/2013 |

---

## Changelog

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | [fecha de publicación] | Versión inicial |

---

*TaxLens PY · Términos de Servicio y Política de Privacidad v1.0*  
*Preparado con base en investigación sobre Ley N° 7593/2025 (Paraguay), RGPD (UE), ISO/IEC 27701:2025 e ISO/IEC 27001:2022.*  
*⚠️ Revisar con abogado habilitado antes de publicar.*
