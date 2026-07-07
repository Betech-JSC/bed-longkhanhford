<?php


namespace App\Services;

class VNPayService
{
    public const STATUS_PAID_SUCCESS = 1;

    public $vnpTmnCode;
    public $vnpHashSecret;
    public $vnpUrl;

    public function __construct()
    {
        $this->vnpTmnCode = config('services.vnpay.code') ?? "SI7Y7M67";
        $this->vnpHashSecret = config('services.vnpay.hash_secret') ?? "ZPYQZAORQRPFTPERKDXEDDMHTTGTOEVU";

        if (config('services.vnpay.test_mode') || true) {
            $this->vnpUrl = "http://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        } else {
            $this->vnpUrl = "https://pay.vnpay.vn/vpcpay.html";
        }
    }

    /**
     * Gui request
     *
     * @param array $params
     * @return string
     */
    public static function send(array $params): string
    {
        return (new self())->createUrl($params);
    }

    /**
     * Lay ket qua
     *
     * @param array $params
     * @return array
     */
    public static function completePurchase(array $params): array
    {
        return (new self())->IPN($params);
    }

    /**
     * Push result
     *
     * https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/
     *
     * @param array $params
     * - amount
     * - return_url
     * - ref_id
     *
     * @return string
     */
    public function createUrl(array $params): string
    {
        $vnpAmount = (int)$params['vnp_Amount'] * 100;

        $inputData = [
            "vnp_Amount" => $vnpAmount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => request()->ip(),
            "vnp_Locale" => 'vn',
            "vnp_OrderInfo" => 'Thanh toan don hang ' . $params['vnp_TxnRef'],
            "vnp_OrderType" => 'other',
            "vnp_TmnCode" => $this->vnpTmnCode,
            "vnp_ReturnUrl" => $params['vnp_ReturnUrl'],
            "vnp_TxnRef" => $params['vnp_TxnRef'],
            "vnp_Version" => "2.1.0",
        ];

        $query = '';
        foreach ($inputData as $key => $value) {
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $VnpUrl = $this->vnpUrl . "?" . $query;

        $VnpUrl .= 'vnp_SecureHash=' . $this->hashHmac($inputData);

        return $VnpUrl;
    }

    /**
     * Payment Notify
     * IPN URL: Ghi nhận kết quả thanh toán từ VNPAY
     * Các bước thực hiện:
     * Kiểm tra checksum
     * Tìm giao dịch trong database
     * Kiểm tra số tiền giữa hai hệ thống
     * Kiểm tra tình trạng của giao dịch trước khi cập nhật
     * Cập nhật kết quả vào Database
     * Trả kết quả ghi nhận lại cho VNPAY
     *
     * - Docs: https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop/#code-ipn-url
     *
     * - Link demo: https://sandbox.vnpayment.vn/tryitnow/Home/VnPayIPN?vnp_Amount=1000000&vnp_BankCode=NCB&vnp_BankTranNo=20170829152730&vnp_CardType=ATM&vnp_OrderInfo=Thanh+toan+don+hang+thoi+gian%3A+2017-08-29+15%3A27%3A02&vnp_PayDate=20170829153052&vnp_ResponseCode=00&vnp_TmnCode=2QXUI4J4&vnp_TransactionNo=12996460&vnp_TxnRef=23597&vnp_SecureHashType=SHA256&vnp_SecureHash=20081f0ee1cc6b524e273b6d4050fefd
     *
     * @param array $params
     *  - vnp_Amount: Số tiền thanh toán VNPAY phản hồi (chia 100) $inputData['vnp_Amount'] / 100
     *  - vnp_BankCode: Ngân hàng thanh toán
     *  - vnp_BankTranNo
     *  - vnp_CardType
     *  - vnp_OrderInfo
     *  - vnp_PayDate
     *  - vnp_ResponseCode
     *  - vnp_TmnCode
     *  - vnp_TransactionNo: Mã giao dịch tại VNPAY
     *  - vnp_TxnRef
     *  - vnp_SecureHashType
     *  - vnp_SecureHash
     *
     * @return array
     */
    public function IPN(array $params): array
    {
        $inputData = [];

        foreach ($params as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }

        $vnp_SecureHash = $inputData['vnp_SecureHash'];
        unset($inputData['vnp_SecureHash']);
        $secureHash = $this->hashHmac($inputData);

        $status = 0;

        if ($secureHash == $vnp_SecureHash && $params['vnp_ResponseCode'] == '00') {
            $status = 1;
        }

        return [
            'order_id' => $params['vnp_TxnRef'],
            'status' => $status,
            'response' => null
        ];
    }

    /**
     * @param array $inputData
     * @return string
     */
    public function hashHmac(array $inputData): string
    {
        $i = 0;
        $hashData = "";

        ksort($inputData);
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        return hash_hmac('sha512', $hashData, $this->vnpHashSecret);
    }
}
