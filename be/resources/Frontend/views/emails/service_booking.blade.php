<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333333; margin: 0; padding: 20px;">
    <div style="margin-bottom: 8px;">
        Từ khách hàng: {{ $customer_name }}
    </div>
    <div style="margin-bottom: 8px;">
        Số điện thoại: {{ $phone }}
    </div>
    <div style="margin-bottom: 8px;">
        E-mail: {{ $email }}
    </div>
    <div style="margin-bottom: 8px;">
        Biển số xe: {{ $license_plate }}
    </div>
    <div style="margin-bottom: 8px;">
        Thời gian hẹn: {{ $appointment_time }}
    </div>
    <div style="margin-bottom: 8px;">
        Nội dung yêu cầu dịch vụ:
        @if(!empty($content))
            <br>{!! nl2br(e($content)) !!}
        @endif
    </div>
    <div style="margin-bottom: 8px;">
        Tại: {{ $location }}
    </div>
    
    @if(isset($url))
    <div style="margin-top: 20px; margin-bottom: 20px;">
        <a href="{{ $url }}" style="display: inline-block; background-color: #2d3748; color: #ffffff; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 13px;">
            Xem chi tiết trong CMS
        </a>
    </div>
    @endif

    <div style="margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 15px; color: #777777; font-size: 12px; line-height: 1.4;">
        --<br>
        Đây là email yêu cầu dịch vụ từ Longkhanhford.com.vn
    </div>
</body>
</html>
