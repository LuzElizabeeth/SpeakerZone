<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>SpeakerZone - Tu plataforma de conferencias</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <style>
        body {margin:0;padding:0; box-sizing:border-box;}
        .navbar {
            width: 100%;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fff;
            box-shadow: 0 0 14px 0 #c7d2fe44;
            position: fixed;
            top: 0; left: 0; z-index: 100;
            padding: 0 40px;
        }
        .navbar-logo {
            height: 54px;
            display: flex;
            align-items: center;
        }
        .navbar-logo img {
            height: 38px;
            margin-right: 9px;
        }
        .navbar-links {
            display: flex;
            align-items: center;
            gap: 22px;
        }
        .navbar-links a {
            color: #3730a3;
            font-weight: 500;
            font-size: 16px;
        }
        .navbar-actions {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        .navbar-actions .btn {
            padding: 7px 20px;
            border-radius: 7px;
            border: none;
            background: linear-gradient(90deg,#6366f1 0%, #06b6d4 100%);
            color: #fff;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            transition: background 0.13s, box-shadow 0.13s;
            box-shadow: 0 2px 8px #6366f11a;
        }
        .navbar-actions .btn.secondary {
            background: #f1f5f9;
            color: #312e81;
            border: 1.5px solid #6366f1;
        }
        .hero {
            padding-top: 110px;
            padding-bottom: 60px;
            background: linear-gradient(120deg, #e0e7ff 0%, #f0fdfa 100%);
            text-align: center;
        }
        .hero-title {
            font-size: 2.6em;
            font-weight: bold;
            color: #312e81;
            margin-bottom: 18px;
        }
        .hero-desc {
            color: #374151;
            font-size: 1.25em;
            margin-bottom: 30px;
        }
        .hero-btns {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-bottom: 38px;
        }
        .hero-img {
            max-width: 520px;
            width: 95vw;
            margin: 0 auto;
            border-radius: 18px;
            box-shadow: 0 8px 38px #818cf833;
            display:block;
        }
        .section {
            max-width: 1100px;
            margin: 60px auto 0 auto;
            padding: 0 3vw;
            text-align: center;
        }
        .section-title {
            font-size: 2em;
            color: #312e81;
            margin-bottom: 18px;
        }
        .features {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 38px;
            margin-top: 30px;
        }
        .feature {
            background: #fff;
            border-radius: 14px;
            box-shadow: 0 4px 22px #6366f118;
            padding: 30px 22px;
            max-width: 320px;
            flex: 1 1 250px;
            min-width: 210px;
        }
        .feature-icon {
            font-size: 2.3em;
            margin-bottom: 12px;
            color: #06b6d4;
        }
        .feature-title {
            font-size: 1.15em;
            font-weight: bold;
            margin-bottom: 8px;
            color: #374151;
        }
        .feature-desc {
            font-size: 1em;
            color: #6b7280;
        }
        .footer {
            margin-top: 60px;
            background: #312e81;
            color: #fff;
            padding: 32px 0 18px 0;
            text-align: center;
        }
        .footer a {color:#a5b4fc;}
        @media (max-width: 800px) {
            .features {flex-direction:column;gap:18px;}
            .navbar {padding: 0 10vw;}
        }
        @media (max-width: 600px) {
            .hero-title {font-size: 1.5em;}
            .section-title {font-size:1.18em;}
            .feature {padding:18px 8px;}
            .navbar {padding: 0 2vw;}
        }
    </style>
</head>
<body>
    <!-- Barra de navegación -->
    <div class="navbar">
        <div class="navbar-logo">
            <img src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png" alt="Logo SpeakerZone">
            <span style="font-size:1.21em;font-weight:bold;color:#312e81;">SpeakerZone</span>
        </div>
        <div class="navbar-links">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#ventajas">Ventajas</a>
            <a href="#conferencias">Conferencias</a>
        </div>
        <div class="navbar-actions">
            <a href="login.php" class="btn secondary">Iniciar sesión</a>
            <a href="register.php" class="btn">Crear cuenta</a>
        </div>
    </div>

    <!-- Hero principal -->
    <section class="hero">
        <div class="hero-title">Gestiona tus <span style="color:#06b6d4;">conferencias universitarias</span> en un solo lugar</div>
        <div class="hero-desc">
            SpeakerZone conecta ponentes y asistentes para crear eventos inolvidables.<br>
            Organiza, asiste y haz networking en una plataforma moderna y fácil de usar.
        </div>
        <div class="hero-btns">
            <a href="register.php" class="btn">Comenzar ahora</a>
            <a href="conferencias.php" class="btn secondary">Ver conferencias</a>
        </div>
        <img class="hero-img" src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80" alt="Conferencia universitara">
    </section>

    <!-- Sección Cómo funciona -->
    <section class="section" id="como-funciona">
        <div class="section-title">¿Cómo funciona SpeakerZone?</div>
        <div class="features">
            <div class="feature">
                <div class="feature-icon">🎤</div>
                <div class="feature-title">Para organizadores</div>
                <div class="feature-desc">
                    Crea y gestiona conferencias, asigna ponentes, controla inscripciones y obtén reportes en tiempo real.
                </div>
            </div>
            <div class="feature">
                <div class="feature-icon">🧑‍💻</div>
                <div class="feature-title">Para ponentes</div>
                <div class="feature-desc">
                    Presenta tus charlas, comparte materiales y conecta con tu audiencia de manera sencilla.
                </div>
            </div>
            <div class="feature">
                <div class="feature-icon">🙋‍♀️</div>
                <div class="feature-title">Para asistentes</div>
                <div class="feature-desc">
                    Descubre eventos, inscríbete a conferencias y obtén certificados de participación.
                </div>
            </div>
        </div>
    </section>

    <!-- Sección Ventajas -->
    <section class="section" id="ventajas">
        <div class="section-title">Ventajas de usar SpeakerZone</div>
        <div class="features">
            <div class="feature">
                <div class="feature-icon">⏱️</div>
                <div class="feature-title">Ahorra tiempo</div>
                <div class="feature-desc">
                    Automatiza tareas administrativas, recordatorios y gestión de inscripciones.
                </div>
            </div>
            <div class="feature">
                <div class="feature-icon">🔒</div>
                <div class="feature-title">Plataforma segura</div>
                <div class="feature-desc">
                    Tus datos y los de tus asistentes están siempre protegidos.
                </div>
            </div>
            <div class="feature">
                <div class="feature-icon">📱</div>
                <div class="feature-title">Acceso multiplataforma</div>
                <div class="feature-desc">
                    Usa SpeakerZone desde tu computadora, tablet o celular sin instalar nada.
                </div>
            </div>
        </div>
    </section>

    <!-- Sección Conferencias disponibles -->
    <section class="section" id="conferencias">
        <div class="section-title">Conferencias destacadas</div>
        <div class="features">
            <div class="feature">
                <div class="feature-title">Inteligencia Artificial en la Educación</div>
                <div class="feature-desc">
                    28/05/2025 - 17:00<br>
                    Modalidad: En línea<br>
                    Ponente: Dra. Ana Robles
                </div>
            </div>
            <div class="feature">
                <div class="feature-title">Desarrollo Web Moderno</div>
                <div class="feature-desc">
                    01/06/2025 - 11:00<br>
                    Modalidad: Presencial<br>
                    Ponente: Ing. Luis Méndez
                </div>
            </div>
            <div class="feature">
                <div class="feature-title">Comunicación Efectiva para Líderes</div>
                <div class="feature-desc">
                    10/06/2025 - 15:30<br>
                    Modalidad: En línea<br>
                    Ponente: Lic. Marisol Pérez
                </div>
            </div>
        </div>
        <div style="margin-top:24px;">
            <a href="conferencias.php" class="btn">Ver todas las conferencias</a>
        </div>
    </section>

    <!-- Footer -->
    <div class="footer">
        &copy; <?=date('Y')?> SpeakerZone · Plataforma de conferencias universitarias
        <br>
        <a href="mailto:soporte@speakerzone.com">soporte@speakerzone.com</a>
    </div>
</body>
</html>