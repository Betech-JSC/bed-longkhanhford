<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Long Khánh Ford - Cổng CMS & API Gateway</title>
    <link rel="shortcut icon" type="image/png" href="/favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        html, body {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }

        body {
            font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #111111; /* gray-900 */
            background-image: radial-gradient(circle at center, #1c1c1c 0%, #111111 100%); /* gray-800 to gray-900 */
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            position: relative;
        }

        /* Background wrapper to isolate blobs and prevent scrolling/misalignment */
        .bg-glow-container {
            position: absolute;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            z-index: 0;
        }

        /* Abstract glowing blobs using project style colors (Orange #F59041 & Ford Blue #0562D2) */
        .glow-blob {
            position: absolute;
            width: 600px;
            height: 600px;
            border-radius: 50%;
            filter: blur(80px);
            pointer-events: none;
            opacity: 0.12;
        }

        .blob-1 {
            top: -15%;
            left: -15%;
            background: radial-gradient(circle, #F59041 0%, rgba(245, 144, 65, 0) 70%); /* Project Orange */
            animation: float-slow 18s infinite ease-in-out;
        }

        .blob-2 {
            bottom: -15%;
            right: -15%;
            background: radial-gradient(circle, #0562D2 0%, rgba(5, 98, 210, 0) 70%); /* Ford Blue */
            animation: float-slow 24s infinite ease-in-out reverse;
        }

        @keyframes float-slow {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(60px, 40px) scale(1.1); }
        }

        .container {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 480px;
            text-align: center;
        }

        /* Card with subtle orange border mirroring project style system */
        .card {
            background: rgba(28, 28, 28, 0.6); /* gray-800 with opacity */
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(245, 144, 65, 0.15); /* Light orange border */
            border-radius: 24px;
            padding: 45px 35px;
            box-shadow: 0 24px 64px rgba(0, 0, 0, 0.7), 
                        inset 0 1px 0 rgba(255, 255, 255, 0.05);
            animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .logo-container {
            margin-bottom: 28px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.03);
            padding: 12px 24px;
            border-radius: 100px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .logo {
            height: 26px;
            margin-right: 12px;
        }

        .brand-name {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 2.5px;
            text-indent: 2.5px; /* Offset the letter-spacing gap on the last character */
            color: #ffffff;
            text-transform: uppercase;
        }

        h1 {
            font-size: 26px;
            font-weight: 600;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
            background: linear-gradient(135deg, #ffffff 0%, #a0aec0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p {
            font-size: 14px;
            color: #a0aec0;
            line-height: 1.6;
            margin-bottom: 36px;
            font-weight: 300;
        }

        .btn-group {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 15px 24px;
            font-size: 15px;
            font-weight: 600;
            border-radius: 12px;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            cursor: pointer;
            letter-spacing: 0.2px;
        }

        /* Primary CMS Login button using system cam #F59041 */
        .btn-primary {
            background-color: #F59041;
            color: #ffffff;
            border: none;
            box-shadow: 0 4px 16px rgba(245, 144, 65, 0.35);
        }

        .btn-primary:hover {
            background-color: #E56400; /* primary.dark */
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(245, 144, 65, 0.55);
        }

        .btn-primary:active {
            transform: translateY(0);
        }

        /* Secondary Client Web button using Ford Blue theme on hover */
        .btn-secondary {
            background: rgba(255, 255, 255, 0.04);
            color: #e2e8f0;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .btn-secondary:hover {
            background-color: #0562D2; /* Ford Blue */
            border-color: #0562D2;
            color: #ffffff;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(5, 98, 210, 0.35);
        }

        .btn-secondary:active {
            transform: translateY(0);
        }

        .footer {
            margin-top: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            font-size: 11px;
            color: #718096;
        }

        .status-dot {
            width: 7px;
            height: 7px;
            background-color: #F59041; /* Pulsing Cam status color matching theme */
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 8px #F59041;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 144, 65, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(245, 144, 65, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 144, 65, 0); }
        }
    </style>
</head>
<body>
    <div class="bg-glow-container">
        <div class="glow-blob blob-1"></div>
        <div class="glow-blob blob-2"></div>
    </div>

    <div class="container">
        <div class="card">
            <div class="logo-container">
                <span class="brand-name">LONG KHÁNH FORD</span>
            </div>
            
            <h1>Portal CMS & API Gateway</h1>
            <p>Hệ thống quản trị Backend CRM và các API endpoint dịch vụ phục vụ cho ứng dụng khách hàng.</p>

            <div class="btn-group">
                <a href="/admin/login" class="btn btn-primary">
                    Đăng nhập hệ thống CMS
                </a>
                <a href="http://localhost:3000" target="_blank" class="btn btn-secondary">
                    Truy cập trang chủ Website
                </a>
            </div>

            <div class="footer">
                <span>Cổng API: <strong style="color: #cbd5e0;">8000</strong></span>
                <span>•</span>
                <span style="display: flex; align-items: center; gap: 6px;">
                    Trạng thái: <span class="status-dot"></span> <strong style="color: #F59041;">Local Dev Active</strong>
                </span>
            </div>
        </div>
    </div>
</body>
</html>
