(function() {
  // Recuperamos la configuración global o usamos valores por defecto
  var config = window.infoWidgetConfig || {};
  var buttonPos = config.buttonPosition || 'bottom-left'; // 'bottom-left' por defecto
  var menuSide = config.menuSide || 'left';               // 'left' por defecto
  var hideTimeout = config.hideTimeout || 5000;
  var widgetBgColor = config.widgetBgColor || 'white';      // color de fondo del widget

  // Mapas de estilos para el botón según la posición elegida
  var buttonStyles = {
    'bottom-left': 'position: fixed; bottom: 80px; left: 20px; line-height: 0; padding: 7px; display: none;',
    'bottom-right': 'position: fixed; bottom: 80px; right: 20px; line-height: 0; padding: 7px; display: none;',
    'top-left': 'position: fixed; top: 20px; left: 20px; line-height: 0; padding: 7px; display: none;',
    'top-right': 'position: fixed; top: 20px; right: 20px; line-height: 0; padding: 7px; display: none;'
  };

  // Inyectamos el CSS necesario, sin restringir el overflow del contenedor padre
  var css = `
    /* Transición del contenedor */
    #infoDataBox {
      transition: opacity 1s ease-in-out, display 1s ease-in-out, width 1s ease-in-out;
    }
    /* Estilos del contenedor del widget */
    .sidebarInfo {
      max-width: 480px;
      position: fixed;
      background-color: ${widgetBgColor};
      border-radius: 5px;
      border: 1px solid #ccc;
      z-index: 2000;
      overflow: visible;
      box-shadow: -8px 8px 41px -16px rgba(66, 68, 90, 1);
      display: block;
      opacity: 1;
      top: 20px;
      ${menuSide === 'right' ? 'right: 20px;' : 'left: 20px;'}
    }
  `;
  var styleEl = document.createElement('style');
  styleEl.type = 'text/css';
  styleEl.appendChild(document.createTextNode(css));
  document.head.appendChild(styleEl);

  // Función para generar el SVG del botón de apertura, con rotación según menuSide
  function getOpenButtonSVG() {
    var rotationStyle = menuSide === 'right' ? 'transform: rotate(180deg);' : '';
    return `
      <svg style="${rotationStyle}" fill="#1C2033" width="30" height="30" version="1.1"
           xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <g>
          <path d="M35.2,20.5c-0.9-0.9-2.3-0.9-3.2,0c-0.9,0.9-0.9,2.3,0,3.2l6,6.1H20.7c-1.2,0-2.2,1-2.2,2.2
                   c0,1.2,1,2.2,2.2,2.2H38l-6,6.1c-0.9,0.9-0.9,2.3,0,3.2c0.4,0.4,1,0.6,1.6,0.6
                   c0.6,0,1.2-0.2,1.6-0.7l9.8-9.9c0.9-0.9,0.9-2.3,0-3.2L35.2,20.5z" />
          <path d="M32,1.8C15.3,1.8,1.7,15.3,1.7,32S15.3,62.2,32,62.2S62.3,48.7,62.3,32
                   S48.7,1.8,32,1.8z M32,57.8C17.8,57.8,6.2,46.2,6.2,32
                   C6.2,17.8,17.8,6.2,32,6.2S57.8,17.8,57.8,32
                   C57.8,46.2,46.2,57.8,32,57.8z" />
        </g>
      </svg>`;
  }

  function getCloseButtonSVG() {
    return `
      <svg fill="#1C2033" width="25" height="25" version="1.1"
           xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
        <path d="M35.2,32L59.6,7.6c0.9-0.9,0.9-2.3,0-3.2
                 c-0.9-0.9-2.3-0.9-3.2,0L32,28.8L7.6,4.4c-0.9-0.9-2.3-0.9-3.2,0
                 c-0.9,0.9-0.9,2.3,0,3.2L28.8,32L4.4,56.4c-0.9,0.9-0.9,2.3,0,3.2
                 c0.4,0.4,1,0.7,1.6,0.7c0.6,0,1.2-0.2,1.6-0.7L32,35.2l24.4,24.4
                 c0.4,0.4,1,0.7,1.6,0.7c0.6,0,1.2-0.2,1.6-0.7
                 c0.9-0.9,0.9-2.3,0-3.2L35.2,32z" />
      </svg>`;
  }

  // Creamos el botón de apertura
  var openButton = document.createElement('button');
  openButton.id = 'openInfoData';
  openButton.type = 'button';
  openButton.className = 'btn btn-primary';
  openButton.style.cssText = buttonStyles[buttonPos] || buttonStyles['bottom-left'];
  openButton.innerHTML = getOpenButtonSVG();

  // Creamos el contenedor principal (widget)
  var widgetDiv = document.createElement('div');
  widgetDiv.id = 'infoDataBox';
  widgetDiv.className = 'sidebarInfo';
  widgetDiv.innerHTML = `
    <div style="padding: 20px; display: flex; justify-content: space-between; align-items: center;">
      <h4 style="margin: 0;">Información básica sobre Protección de Datos</h4>
      <span id="closeInfoData" style="cursor:pointer;">${getCloseButtonSVG()}</span>
    </div>
        <div style="padding: 20px; padding-top: 0; overflow-y: auto; height: 100%;">


            <table class="table mb-0" style="font-size:14px">
                <tbody>
                    <tr>

                        <td>
                            <strong> Responsable </strong>

                            <span class="text-primary" type="button" data-toggle="collapse"
                                data-target="#collapseResponsable" aria-expanded="false"
                                aria-controls="collapseResponsable" style="float: right;">

                            </span>
                            <p>
                                Info básica de protección de datos. Responsable del tratamiento: ABY MARKETING DREAMS SL
                                (Aby Group
                                marca registrada). Fines: proporcionar información sobre ahorro y tarifas en base a sus
                                preferencias.
                                Derechos: acceso, rectificación, oposición, supresión, portabilidad, limitación y a no
                                ser objeto de
                                decisiones automatizadas en nuestro correo dpd@aby.group. Puede ampliar nuestra
                                información sobre el
                                tratamiento de datos en el enlace a la <a
                                    href="https://mimejortarifa.com/privacidad.html" target="_blank"> Politica
                                    Privacidad</a>.
                            </p>

                            <div class="collapse" id="collapseResponsable">
                                <hr />
                                <h5 class="text-primary">
                                    Responsable </h5>
                                <p>La entidad que trata sus datos es ABY MARKETING DREAMS S.L.(en adelante, la
                                    "Compañía“)
                                    Finalidad
                                    Tratamos sus datos para enviarle información sobre productos y/o servicios de
                                    terceras </p>
                                <p> empresas y para ceder sus datos a terceras empresas con fines promocionales.</p>
                                <p><a href="https://mimejortarifa.com/privacidad.html" target="_blank"> Politica
                                        Privacidad</a></p>
                                <p>
                                    Contacto con el Delegado de Protección de Datos:
                                    <a href="mailto: contacto@aby.group">contacto@aby.group</a>
                                </p>
                            </div>
                        </td>

                        <!--<td><a href="#inner_20" title="Más información: Responsable&gt;"><span>&#62;</span></a></td>-->
                    </tr>
                    <tr>

                        <td>
                            <strong> Legitimación</strong>

                            <span class="text-primary" type="button" data-toggle="collapse"
                                data-target="#collapseFinalidad" aria-expanded="false" aria-controls="collapseFinalidad"
                                style="float: right;">

                            </span>
                            <p>
                                La prestación de su consentimiento. <a href="https://mimejortarifa.com/privacidad.html"
                                    target="_blank">
                                    Politica
                                    Privacidad</a>
                            </p>
                            <div class="collapse" id="collapseFinalidad">
                                <hr />
                                <h5 class="">
                                    Tratamos sus datos para poder prestarle nuestros servicios y
                                    enviarle información sobre productos y/o servicios de
                                    terceras empresas.
                                </h5>
                                <p>
                                    Para más información sobre ello consulte la <a
                                        href="https://mimejortarifa.com/privacidad.html" target="_blank"> política de
                                        privacidad.</a>
                                </p>
                            </div>
                        </td>
                        <!--<td><a href="#inner_21" title="Más información: Finalidad<br><a href=#inner_21 title=Más&nbsp;información><span class=circle_lopd>&gt;</span></a>"><span>&#62;</span></a></td>-->
                    </tr>
                    <tr>

                        <td>
                            <strong> Destinatarios </strong>

                            <span class="text-primary" type="button" data-toggle="collapse"
                                data-target="#collapseLegitimacion" aria-expanded="false"
                                aria-controls="collapseLegitimacion" style="float: right;">

                            </span>
                            <p>
                                La prestación de su consentimiento. <a href="https://mimejortarifa.com/privacidad.html"
                                    target="_blank">
                                    Politica
                                    Privacidad</a>
                            </p>


                            <div class="collapse" id="collapseLegitimacion">
                                <hr />
                                <h5 class="">

                                </h5>
                                <p>
                                    Sí. Sus datos podrán ser cedidos a terceras empresas relacionadas con los sectores
                                    de actividad que se
                                    detallan en la Política de Privacidad de ABY MARKETING DREAMS S.L.
                                </p>
                                <p>
                                    con la finalidad de enviarle comunicaciones comerciales sobre la actividad de estas.
                                    Politica
                                    Privacidad
                                    cabo la prestación de los servicios que haya solicitado a través del Sitio Web.
                                </p>
                            </div>

                        </td>
                        <!--<td><a href="#inner_22" title="Más información: Legitimación<br><a href=#inner_22 title=Más&nbsp;información><span class=circle_lopd>&gt;</span></a>"><span>&#62;</span></a></td>-->
                    </tr>
                    <tr>

                        <td>
                            <strong> Destinatarios </strong>

                            <span class="text-primary" type="button" data-toggle="collapse"
                                data-target="#collapseDestinatarios" aria-expanded="false"
                                aria-controls="collapseDestinatarios" style="float: right;">

                            </span>
                            <p>
                                Sí. Sus datos podrán ser cedidos a terceras empresas
                                relacionadas con los sectores de actividad que se detallan en la
                                Política de Privacidad de ABY MARKETING DREAMS S.L. con la
                                finalidad de enviarle comunicaciones comerciales sobre la
                                actividad de estas. <a href="https://mimejortarifa.com/privacidad.html" target="_blank">
                                    Politica
                                    Privacidad</a>
                            </p>

                            <div class="collapse" id="collapseDestinatarios">
                                <hr />
                                <h5 class="text-primary">
                                    ¿A QUÉ DESTINATARIOS SE COMUNICARÁN SUS DATOS PERSONALES?
                                </h5>

                                <p>ABY MARKETING DREAMS SL podrá tratar sus datos, siempre y cuando haya
                                    aceptado este tratamiento de datos personales para enviarle por carta,
                                    teléfono, correo electrónico, SMS/MMS, o por otros medios de comunicación
                                    electrónica equivalentes, comunicaciones comerciales o información de
                                    empresas relacionadas con los siguientes sectores:</p>

                                <p><strong>Marketing o pertenecientes a Adigital</strong></p>
                                <p><strong>Telecomunicaciones:</strong> Productos y Servicios de telecomunicaciones
                                    y
                                    tecnología.</p>
                                <p><strong>Financiero:</strong> Prestados por entidades financieras,
                                    Intermediariosfinancieros, Aseguradoras y de Previsión social.</p>
                                <p><strong>Ocio:</strong> Editorial, Turismo, Deportes, Coleccionismo, Fotografía,
                                    Pasatiempos,
                                    Juguetería, Transporte, Jardinería, Hobbies, Loterías, peñas de loterías,
                                    Comunicación y entretenimiento.</p>
                                <p><strong>Gran consumo:</strong> Electrónica, Informática, Textil, Imagen y Sonido,
                                    Complementos, Hogar, Bazar, Cuidado personal (Cosmética, Perfumería,
                                    Parafarmacia, especialidades Farmacéuticas publicitarias) Mobiliario,
                                    Inmobiliario, Alimentación y Bebidas, salud y belleza, Material de oficina.
                                    Moda y decoración.</p>
                                <p><strong>Automoción:</strong> Productos y Servicios relacionados con el Automóvil,
                                    Motocicletas y Camiones.</p>
                                <p><strong>Energía y agua:</strong> Productos relacionados con la Electricidad,
                                    Hidrocarburos,
                                    Gas y Agua.</p>
                                <p><strong>ONG:</strong> Productos y Servicios relacionados con ONG e ideologías.
                                </p>
                                <p><strong>Joyería y piedras preciosas:</strong> productos y servicios relacionados
                                    con la
                                    joyería, bisutería y piedras preciosas.</p>

                                <p>No obstante, el Usuario podrá revocar el consentimiento, en cada comunicado
                                    comercial o publicitario que se le haga llegar, y en cualquier momento,
                                    mediante notificación en la siguiente dirección de correo
                                    electrónico <a href="mailto:baja@aby.group/">baja@aby.group</a> o
                                    mediante carta dirigida a Alameda Mazarredo 47, 48009 Bilbao, España.</p>

                            </div>

                        </td>

                    </tr>
                    <tr>

                        <td>
                            <strong> Derechos </strong>

                            <span class="text-primary" type="button" data-toggle="collapse"
                                data-target="#collapseDerechos" aria-expanded="false" aria-controls="collapseDerechos"
                                style="float: right;">

                            </span>
                            <p>El interesado tiene derecho a ejercitar su derecho de:</p>
                            <p>
                                Acceso, Rectificación, Supresión, Oposición, Portabilidad de los Datos, Limitación
                                del Tratamiento, Derecho al Olvido.
                                <a href="https://mimejortarifa.com/privacidad.html" target="_blank"> Politica
                                    Privacidad</a>
                            <div class="collapse" id="collapseDerechos">
                                <hr />
                                <h5 class="text-primary">
                                    ¿CUALES SON SUS DERECHOS CUANDO NOS FACILITA SUS DATOS PERSONALES?
                                </h5>
                                <h4>Usted tiene derecho a:</h4>
                                <ul>
                                    <li>Acceder a sus datos de carácter personal.</li>
                                    <li>Solicitar su rectificación</li>
                                    <li>Solicitar su supresión</li>
                                    <li>Oponerse a su tratamiento.</li>
                                    <li>Solicitar la limitación de su tratamiento.</li>
                                    <li>La portabilidad de datos personales.</li>
                                    <li>A no ser objeto de decisiones automatizadas</li>
                                </ul>
                                <p></p>
                                <p>Usted podrá ejercer sus derechos dirigiéndose directa
                                    y gratuitamente a la siguiente dirección de correo electrónico <a
                                        href="mailto:contacto@aby.group">
                                        contacto@aby.group </a> indicando en el asunto “EJERCICIO
                                    DE DERECHOS” o mediante comunicación escrita a la siguiente dirección:
                                    ABY MARKETING DREAMS SL Calle Ayala 85, 1ºC, 28006 Madrid.</p>
                                <p>Su
                                    solicitud deberá incluir fecha, nombre y apellidos, petición en que se
                                    concreta la solicitud, dirección a efectos de notificaciones. Con el fin de
                                    disipar cualquier duda razonable sobre la identidad de la persona física que
                                    cursa la solicitud, se solicita la aportación del DNI o documento de
                                    naturaleza análoga o similar, para confirmar la identidad del
                                    mismo.</p>
                                <p>En caso de entender que ABY MARKETING DREAMS SL no ha resuelto
                                    correctamente su solicitud, usted podrá dirigirse a solicitar la tutela de
                                    la Agencia Española de Protección de Datos, cuyos datos puede consultar en
                                    <a href="http://www.agpd.es" target="_blank">www.agpd.es</a>
                                </p>

                            </div>
                            </p>
                        </td>

                    </tr>
                    <tr>

                        <td>
                            <strong>Información adicional </strong>

                            <span class="text-primary" type="button" data-toggle="collapse" data-target="#collapseInfo"
                                aria-expanded="false" aria-controls="collapseInfo" style="float: right;">

                            </span>
                            <p>
                                Puede consultar la información adicional acerca de la protección
                                de sus datos personales o para darse de baja enviando un email a
                                la siguiente dirección: contacto@aby.group.
                                <a href="https://mimejortarifa.com/privacidad.html" target="_blank"> Politica
                                    Privacidad</a>
                            </p>

                            <div class="collapse" id="collapseInfo">
                                <hr />
                                <h5 class="text-primary">
                                    Información adicional y procedencia
                                </h5>

                                <p>Por favor lea detenidamente y siga las siguientes recomendaciones:</p>

                                <p>El Sitio Web no está dirigido a menores de edad. Por favor active el control
                                    parental para prevenir y controlar el acceso de menores de edad a Internet e
                                    informar a los menores de edad sobre aspectos relativos a la seguridad.</p>

                                <p>Mantenga en su equipo un software antivirus instalado y debidamente
                                    actualizado, que garantice que su equipo se encuentra libre de software
                                    maligno, así como de aplicaciones spyware que pongan en riesgo su navegación
                                    en Internet, y en peligro la información alojada en el equipo.</p>

                                <p>Revise y lea los textos legales, así como la presente Política de Privacidad
                                    que ABY MARKETING DREAMS pone a su disposición en el Sitio Web.</p>

                                <p>Si tiene alguna pregunta sobre la presente Política de Privacidad, le rogamos
                                    que se ponga en contacto con nosotros enviando un correo electrónico a la
                                    dirección <a href="mailto:contacto@aby.group/">
                                        contacto@aby.group </a>
                                </p>

                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
`;

  // Funciones para abrir y cerrar el widget
  function openInfoData() {
    widgetDiv.style.display = "block";
    widgetDiv.style.opacity = "1";
    openButton.style.display = "none";
  }

  function closeInfoData() {
    widgetDiv.style.display = "none";
    widgetDiv.style.opacity = "0";
    openButton.style.display = "block";
  }

  // Asignamos los eventos
  openButton.addEventListener('click', openInfoData);
  widgetDiv.querySelector('#closeInfoData').addEventListener('click', closeInfoData);

  // Añadimos los elementos al DOM
  document.body.appendChild(openButton);
  document.body.appendChild(widgetDiv);

  // Opción: ocultar automáticamente el widget después de un tiempo
  window.addEventListener('load', function() {
    setTimeout(function() {
      closeInfoData();
    }, hideTimeout);
  });

})();
