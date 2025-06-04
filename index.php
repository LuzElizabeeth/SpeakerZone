<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>SpeakerZone - Plataforma de conferencias de tu interés</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- AOS Animate On Scroll CSS -->
    <link href="https://unpkg.com/aos@2.3.4/dist/aos.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <style>
        body {margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif;}
        .navbar {
            width: 100vw;
            height: 68px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fff;
            box-shadow: 0 0 14px 0 #c7d2fe44;
            position: fixed;
            top: 0; left: 0; z-index: 100;
            padding: 0 36px;
            transition: top 0.3s;
        }
        .navbar-logo {
            display: flex;
            align-items: center;
        }
        .navbar-logo img {
            height: 36px;
            margin-right: 8px;
        }
        .navbar-links {
            display: flex;
            align-items: center;
            gap: 28px;
        }
        .navbar-links a {
            color: #3730a3;
            font-weight: 500;
            font-size: 16px;
            text-decoration: none;
            opacity: 0.85;
            transition: opacity 0.12s;
        }
        .navbar-links a:hover {opacity: 1;}
        .navbar-actions {
            display: flex;
            gap: 10px;
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
        /* Hamburger icon for mobile */
        .navbar-toggle {
            display: none;
            flex-direction: column;
            justify-content: center;
            cursor: pointer;
            width: 34px;
            height: 34px;
            margin-left: 12px;
        }
        .navbar-toggle span {
            height: 4px;
            width: 100%;
            background: #6366f1;
            margin: 4px 0;
            border-radius: 2px;
            transition: 0.4s;
        }
        /* Hero */
        .hero {
            padding-top: 110px;
            padding-bottom: 60px;
            background: linear-gradient(120deg, #e0e7ff 0%, #f0fdfa 100%);
            text-align: center;
            min-height: 85vh;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
        }
        .hero-title {
            font-size: 2.8em;
            font-weight: bold;
            color: #312e81;
            margin-bottom: 12px;
            line-height: 1.15;
        }
        .hero-desc {
            color: #374151;
            font-size: 1.25em;
            margin-bottom: 30px;
            line-height: 1.6;
            max-width: 540px;
            margin-left:auto;
            margin-right:auto;
        }
        .hero-btns {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-bottom: 38px;
        }
        .hero-btns .btn {
            font-size: 1.12em;
            padding: 11px 28px;
        }
        .hero-img {
            max-width: 420px;
            width: 95vw;
            margin: 0 auto;
            margin-top: 25px;
            border-radius: 18px;
            box-shadow: 0 8px 38px #818cf833;
            display:block;
            transition: transform 0.4s cubic-bezier(.4,2.3,.3,1);
        }
        .hero-img:hover {transform: scale(1.03);}
        /* Section */
        .section {
            max-width: 1100px;
            margin: 70px auto 0 auto;
            padding: 0 3vw;
            text-align: center;
        }
        .section-title {
            font-size: 1.7em;
            color: #312e81;
            margin-bottom: 18px;
            font-weight:bold;
            letter-spacing: 0.5px;
        }
        .features {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 36px;
            margin-top: 22px;
        }
        .feature {
            background: #fff;
            border-radius: 15px;
            box-shadow: 0 4px 18px #6366f118;
            padding: 32px 21px 25px 21px;
            max-width: 290px;
            min-width: 170px;
            flex: 1 1 170px;
            text-align: left;
            margin-bottom: 8px;
            transition:transform 0.33s cubic-bezier(.4,2.3,.3,1), box-shadow 0.33s;
        }
        .feature:hover {
            transform: translateY(-9px) scale(1.04);
            box-shadow: 0 8px 34px #6366f122;
            z-index: 3;
        }
        .feature-icon {
            font-size: 2.1em;
            margin-bottom: 11px;
            color: #06b6d4;
        }
        .feature-title {
            font-size: 1.12em;
            font-weight: bold;
            margin-bottom: 7px;
            color: #374151;
        }
        .feature-desc {
            font-size: 0.97em;
            color: #6b7280;
        }
        .section-divider {
            width: 60px;
            height: 4px;
            margin: 18px auto 0 auto;
            border-radius: 3px;
            background: linear-gradient(90deg,#6366f1 0%, #06b6d4 100%);
            opacity: 0.17;
        }
        /* Footer */
        .footer {
            margin-top: 60px;
            background: #312e81;
            color: #fff;
            padding: 28px 0 13px 0;
            text-align: center;
            font-size: 1em;
        }
        .footer a {color:#a5b4fc;}
        /* Responsive */
        @media (max-width: 900px) {
            .features {flex-direction:column;gap:15px;}
            .navbar {padding: 0 3vw;}
        }
        @media (max-width: 600px) {
            .hero-title {font-size: 1.19em;}
            .section-title {font-size:1.02em;}
            .feature {padding:14px 9px;}
            .navbar {padding: 0 1vw;}
            .navbar-links { display:none; position:fixed; left:0; top:68px; background:#fff; width:100vw; flex-direction:column; gap:0; border-bottom:1px solid #e0e7ff;}
            .navbar-links.open {display:flex;}
            .navbar-links a {padding:18px 0;border-top:1px solid #f0fdfa;}
            .navbar-toggle {display:flex;}
        }
    </style>
</head>
<body>
    <!-- Barra de navegación -->
    <div class="navbar" id="navbar">
        <div class="navbar-logo">
            <img src="logo.jpeg" alt="Logo SpeakerZone">
            <span style="font-size:1.15em;font-weight:bold;color:#312e81;">SpeakerZone</span>
        </div>
        <div class="navbar-links" id="navbarLinks">
            <a href="#como-funciona">¿Cómo funciona?</a>
            <a href="#ventajas">Ventajas</a>
            <a href="conferencias">Conferencias</a>
        </div>
        <div class="navbar-actions">
            <a href="login.php" class="btn secondary">Iniciar sesión</a>
            <a href="register.php" class="btn">Registrarse</a>
            <div class="navbar-toggle" id="navbarToggle" aria-label="Abrir menú">
                <span></span><span></span><span></span>
            </div>
        </div>
    </div>

    <!-- Hero principal -->
    <section class="hero" data-aos="fade-up">
        <div class="hero-title">
            Tu espacio para <span style="color:#06b6d4;">conferencias de tu interés </span>
        </div>
        <div class="hero-desc">
            Organiza, asiste y participa en conferencias de manera sencilla.<br>
            Una plataforma ágil y moderna para conectar ideas, personas y conocimiento.
        </div>
        <div class="hero-btns">
            <a href="register.php" class="btn" data-aos="fade-up" data-aos-delay="100">Comenzar</a>
            <a href="conferencias.php" class="btn secondary" data-aos="fade-up" data-aos-delay="200">Ver conferencias</a>
        </div>
        <img class="hero-img" src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80" alt="Auditorio de conferencias" data-aos="zoom-in" data-aos-delay="200">
    </section>

    <!-- Sección Cómo funciona -->
    <section class="section" id="como-funciona">
        <div class="section-title" data-aos="fade-right">¿Cómo funciona?</div>
        <div class="section-divider"></div>
        <div class="features">
            <div class="feature" data-aos="fade-up" data-aos-delay="0">
                <div class="feature-icon">🎤</div>
                <div class="feature-title">Organizadores</div>
                <div class="feature-desc">
                    Crea conferencias, gestiona horarios y asigna presentadores con facilidad.
                </div>
            </div>
            <div class="feature" data-aos="fade-up" data-aos-delay="80">
                <div class="feature-icon">🧑‍💻</div>
                <div class="feature-title">Presentadores</div>
                <div class="feature-desc">
                    Comparte tus conocimientos y conecta con la audiencia.
                </div>
            </div>
            <div class="feature" data-aos="fade-up" data-aos-delay="160">
                <div class="feature-icon">🙋‍♀️</div>
                <div class="feature-title">Asistentes</div>
                <div class="feature-desc">
                    Descubre eventos, inscríbete y obtén certificados.
                </div>
            </div>
        </div>
    </section>

    <!-- Sección Ventajas -->
    <section class="section" id="ventajas">
        <div class="section-title" data-aos="fade-right">Ventajas de SpeakerZone</div>
        <div class="section-divider"></div>
        <div class="features">
            <div class="feature" data-aos="fade-up" data-aos-delay="0">
                <div class="feature-icon">⏱️</div>
                <div class="feature-title">Ahorra tiempo</div>
                <div class="feature-desc">
                    Automatización de inscripciones y gestión eficiente de eventos.
                </div>
            </div>
            <div class="feature" data-aos="fade-up" data-aos-delay="80">
                <div class="feature-icon">🔒</div>
                <div class="feature-title">Privacidad</div>
                <div class="feature-desc">
                    Tus datos y los de tus asistentes siempre estarán protegidos.
                </div>
            </div>
            <div class="feature" data-aos="fade-up" data-aos-delay="160">
                <div class="feature-icon">📱</div>
                <div class="feature-title">Desde cualquier lugar</div>
                <div class="feature-desc">
                    Accede desde computadora, tablet o celular sin instalar nada.
                </div>
            </div>
        </div>
    </section>

    <!-- Sección Conferencias destacadas -->
    <section class="section" id="conferencias">
        <div class="section-title" data-aos="fade-right">Conferencias destacadas</div>
        <div class="section-divider"></div>
        <div class="features">
            <div class="feature" data-aos="zoom-in-up" data-aos-delay="0">
                <div class="feature-title">Inteligencia Artificial en la Educación</div>
                <div class="feature-desc">
                    28/05/2025 · 17:00<br>
                    Modalidad: En línea<br>
                    Presentador: Dra. Ana Robles
                </div>
            </div>
            <div class="feature" data-aos="zoom-in-up" data-aos-delay="120">
                <div class="feature-title">Desarrollo Web Moderno</div>
                <div class="feature-desc">
                    01/06/2025 · 11:00<br>
                    Modalidad: Presencial<br>
                    Presentador: Ing. Luis Méndez
                </div>
            </div>
        </div>
        <div style="margin-top:18px;">
            <a href="conferencias.php" class="btn" data-aos="fade-up" data-aos-delay="200">Ver todas las conferencias</a>
        </div>
    </section>

    <!-- Footer -->
    <div class="footer">
        &copy; <?=date('Y')?> SpeakerZone · Tu plataforma de conferencias 
        <br>
        <a href="mailto:speakerzone0@gmail.com">speakerzone0@gmail.com</a>
    </div>

    <!-- AOS Animate On Scroll JS -->
    <script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
    <script>
        AOS.init({duration: 850, once:true});
        // Navbar scroll hide/show (optional)
        let lastScrollTop = 0, navbar = document.getElementById('navbar');
        window.addEventListener('scroll', function(){
            let st = window.pageYOffset || document.documentElement.scrollTop;
            if(st > lastScrollTop && st > 60){
                navbar.style.top = '-70px';
            } else {
                navbar.style.top = '0';
            }
            lastScrollTop = st <= 0 ? 0 : st;
        }, false);

        // Hamburger menu for mobile
        const navbarToggle = document.getElementById('navbarToggle');
        const navbarLinks = document.getElementById('navbarLinks');
        navbarToggle.addEventListener('click', function(){
            navbarLinks.classList.toggle('open');
        });
        // Close on link click (mobile)
        Array.from(document.querySelectorAll('.navbar-links a')).forEach(link => {
            link.addEventListener('click',() => {navbarLinks.classList.remove('open')});
        });
    </script>
</body>
</html>