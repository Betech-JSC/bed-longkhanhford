<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    private string $apiKey;
    private string $model;
    private string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key', '');
        $this->model = config('services.gemini.model', 'gemini-2.0-flash');
        $this->baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    }

    /**
     * Gửi message tới Gemini API và nhận response
     */
    public function chat(string $userMessage, array $conversationHistory = []): array
    {
        if (empty($this->apiKey)) {
            return [
                'reply' => 'Xin lỗi, hệ thống trợ lý AI đang được cấu hình. Vui lòng liên hệ Hotline 0918 90 90 60 để được tư vấn trực tiếp.',
                'lead_data' => null,
            ];
        }

        try {
            $systemPrompt = $this->getSystemPrompt();

            $contents = [];

            // Add conversation history
            foreach ($conversationHistory as $msg) {
                $contents[] = $msg;
            }

            // Add current user message
            $contents[] = [
                'role' => 'user',
                'parts' => [['text' => $userMessage]],
            ];

            $response = Http::timeout(30)->post(
                "{$this->baseUrl}/models/{$this->model}:generateContent?key={$this->apiKey}",
                [
                    'system_instruction' => [
                        'parts' => [['text' => $systemPrompt]],
                    ],
                    'contents' => $contents,
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'maxOutputTokens' => 1024,
                        'topP' => 0.9,
                    ],
                ]
            );

            if (!$response->successful()) {
                Log::error('Gemini API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return [
                    'reply' => 'Xin lỗi, tôi đang gặp sự cố kỹ thuật. Bạn có thể gọi trực tiếp Hotline 0918 90 90 60 để được hỗ trợ nhanh nhất!',
                    'lead_data' => null,
                ];
            }

            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

            // Extract lead data from response (nếu bot phát hiện)
            $leadData = $this->extractLeadData($text, $userMessage);

            // Clean response (remove any JSON/metadata bot might have added)
            $cleanReply = $this->cleanResponse($text);

            return [
                'reply' => $cleanReply,
                'lead_data' => $leadData,
            ];
        } catch (\Throwable $e) {
            Log::error('GeminiService exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'reply' => 'Xin lỗi, tôi đang gặp sự cố. Bạn vui lòng gọi Hotline 0918 90 90 60 hoặc chat qua Zalo để được hỗ trợ nhé!',
                'lead_data' => null,
            ];
        }
    }

    /**
     * System Prompt chuyên biệt cho Long Khánh Ford (Dữ liệu động)
     */
    private function getSystemPrompt(): string
    {
        $vehiclesText = '';
        $servicesText = '';

        $cleanText = function($text) {
            if (empty($text)) return '';
            return trim(html_entity_decode(strip_tags($text)));
        };

        try {
            // Fetch active vehicles with active versions
            $vehicles = \App\Models\Vehicle\Vehicle::where('status', \App\Models\Vehicle\Vehicle::STATUS_ACTIVE)
                ->with(['versions' => function($q) {
                    $q->where('status', \App\Models\Vehicle\VehicleVersion::STATUS_ACTIVE)
                      ->sortByPosition();
                }])
                ->sortByPosition()
                ->get();

            if ($vehicles->isNotEmpty()) {
                $specLabels = [
                    'engine' => 'Động cơ',
                    'power' => 'Công suất',
                    'torque' => 'Mô-men xoắn',
                    'transmission' => 'Hộp số',
                    'drivetrain' => 'Hệ dẫn động',
                    'dimensions' => 'Kích thước',
                    'clearance' => 'Khoảng sáng gầm',
                    'fuelEconomy' => 'Tiêu thụ nhiên liệu',
                ];

                foreach ($vehicles as $vehicle) {
                    $vTranslation = $vehicle->translate('vi');
                    $title = $vTranslation?->title ?? $vehicle->title;
                    $tagline = $vTranslation?->tagline ?? $vehicle->tagline;
                    $description = $cleanText($vTranslation?->description ?? $vehicle->description);

                    $vehiclesText .= "### {$title}";
                    if ($tagline) {
                        $vehiclesText .= " ({$tagline})";
                    }
                    $vehiclesText .= "\n";
                    if ($description) {
                        $vehiclesText .= "  * {$description}\n";
                    }

                    if ($vehicle->versions->isNotEmpty()) {
                        foreach ($vehicle->versions as $version) {
                            $verTranslation = $version->translate('vi');
                            $verName = $verTranslation?->name ?? $version->name;
                            $verPrice = $version->price ? number_format($version->price, 0, ',', '.') . 'đ' : 'Liên hệ';
                            $vehiclesText .= "  - Phiên bản {$verName}: {$verPrice}\n";

                            $specs = $version->specs;
                            if (is_array($specs) && !empty($specs)) {
                                $specLines = [];
                                $isNewFormat = false;
                                if (isset($specs[0]) && is_array($specs[0]) && (isset($specs[0]['title']) || isset($specs[0]['category']))) {
                                    $isNewFormat = true;
                                }

                                if ($isNewFormat) {
                                    foreach ($specs as $item) {
                                        $title = $item['title'] ?? $item['category'] ?? '';
                                        $content = $item['content'] ?? '';
                                        if (empty($title) && empty($content)) continue;
                                        $cleanContent = trim(html_entity_decode(strip_tags($content)));
                                        if (!empty($cleanContent)) {
                                            $specLines[] = "{$title}: {$cleanContent}";
                                        }
                                    }
                                } else {
                                    foreach ($specs as $key => $val) {
                                        if (empty($val) || is_array($val)) continue;
                                        $label = $specLabels[$key] ?? ucfirst($key);
                                        $specLines[] = "{$label}: {$val}";
                                    }
                                }
                                if (!empty($specLines)) {
                                    $vehiclesText .= "    * Thông số: " . implode(' | ', $specLines) . "\n";
                                }
                            }
                        }
                    } else {
                        $basePrice = $vehicle->base_price ? number_format($vehicle->base_price, 0, ',', '.') . 'đ' : 'Liên hệ';
                        $vehiclesText .= "  - Giá niêm yết: {$basePrice}\n";
                    }
                    $vehiclesText .= "\n";
                }
            }
        } catch (\Throwable $e) {
            Log::error('GeminiService failed to load vehicles from DB', [
                'message' => $e->getMessage(),
            ]);
        }

        try {
            // Fetch active services
            $services = \App\Models\Service::active()->sortByPosition()->get();
            if ($services->isNotEmpty()) {
                foreach ($services as $service) {
                    $sTranslation = $service->translate('vi');
                    $sTitle = $sTranslation?->title ?? $service->title;
                    $sDesc = $cleanText($sTranslation?->description ?? $service->description);
                    if ($sTitle) {
                        $servicesText .= "- {$sTitle}";
                        if ($sDesc) {
                            $servicesText .= ": {$sDesc}";
                        }
                        $servicesText .= "\n";
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::error('GeminiService failed to load services from DB', [
                'message' => $e->getMessage(),
            ]);
        }

        // Fallback checks
        if (empty($vehiclesText)) {
            $vehiclesText = <<<'FALLBACK_VEHICLES'
### NEW TERRITORY (SUV 5 Chỗ)
- Territory Titanium X 1.5L AT: 954.000.000đ
- Territory Titanium 1.5L AT: 899.000.000đ
- Territory Trend 1.5L AT: 822.000.000đ
- Territory Ambiente 1.5L AT: 739.000.000đ

### FORD EVEREST (SUV 7 Chỗ)
- Everest Titanium+ 2.0L Bi-Turbo 4x4: 1.545.000.000đ
- Everest Titanium 2.0L Turbo 4x2: 1.300.000.000đ
- Everest Sport 2.0L Turbo 4x2: 1.099.000.000đ
- Everest Ambiente 2.0L Turbo 4x2: 1.009.000.000đ

### FORD MUSTANG MACH-E (SUV Điện)
- Mustang Mach-E Premium AWD: 1.995.000.000đ

### NEW RANGER (Bán tải)
- Ranger Wildtrak 2.0L Bi-Turbo 4x4: 979.000.000đ
- Ranger XLS 2.0L AT 4x2: 659.000.000đ
- Ranger XL 2.0L MT 4x2: 559.000.000đ

### FORD TRANSIT (Xe thương mại 16 chỗ)
- Transit SVP Luxury: 1.080.000.000đ
- Transit Luxury: 970.000.000đ
- Transit Mid: 890.000.000đ
- Transit Tiêu chuẩn: 845.000.000đ

### FORD RAPTOR (Bán tải hiệu năng cao)
- Raptor 2.0L Bi-Turbo 4x4: 1.299.000.000đ
FALLBACK_VEHICLES;
        }

        if (empty($servicesText)) {
            $servicesText = <<<'FALLBACK_SERVICES'
- Bảo dưỡng nhanh 60 phút
- Bảo dưỡng định kỳ theo km
- Nhận & Giao xe tận nơi (miễn phí trong 50km)
- Phụ kiện & phụ tùng chính hãng
- Hỗ trợ trả góp lên đến 80% giá trị xe, lãi suất ưu đãi
FALLBACK_SERVICES;
        }

        return <<<PROMPT
Bạn là Trợ lý AI tư vấn của **Long Khánh Ford** (Công ty TNHH Dịch Vụ Thương Mại Ô Tô Tấn Phát) — đại lý ủy quyền chính thức của Ford Việt Nam tại Đồng Nai.

## THÔNG TIN SHOWROOM
- Địa chỉ: Xuân Tân, Long Khánh, Đồng Nai
- Hotline: 0812 86 86 22
- Email: marketing@longkhanhford.com.vn
- Giờ làm việc: T2–T7, 7:30–17:30
- Website: longkhanhford.com.vn

## BẢNG GIÁ XE FORD (Cập nhật trực tiếp từ hệ thống, giá niêm yết VNĐ, chưa bao gồm phí lăn bánh)
{$vehiclesText}
## DỊCH VỤ CỦA ĐẠI LÝ
{$servicesText}
## CHÍNH SÁCH CHUNG
- Bảo hành chính hãng 3 năm hoặc 100.000km
- Cứu hộ 24/7: 0938 229 994
- Hỗ trợ đăng ký, đăng kiểm, bảo hiểm trọn gói

## QUY TẮC TƯ VẤN
1. Luôn trả lời bằng tiếng Việt, thân thiện, chuyên nghiệp, xưng hô lịch sự (Em - Anh/Chị).
2. Trả lời ngắn gọn, cô đọng (2-4 câu), đúng trọng tâm câu hỏi.
3. Khi khách muốn tìm hiểu chọn xe hoặc hỏi so sánh các dòng xe -> Hãy tư vấn nhanh, sau đó đính kèm thẻ gợi ý xe tương ứng ở cuối câu trả lời:
   [RECOMMEND_VEHICLE]{"slugs":["everest","ranger"],"reason":"Mô tả ngắn gọn lý do gợi ý dòng xe này"}[/RECOMMEND_VEHICLE]
   (Hãy dùng đúng các slug xe có trong database như: `everest`, `territory`, `ranger`, `transit`, `raptor`, `mustang-mach-e`...).
4. Khi khách hàng có nhu cầu lái thử, báo giá chi tiết, đăng ký trả góp, tư vấn khuyến mãi, hoặc muốn để lại số điện thoại -> Hãy trả lời lịch sự và tự động kích hoạt Form đăng ký thông tin ở cuối tin nhắn:
   [SHOW_LEAD_FORM]{"type":"test_drive|quote|callback","vehicle":"Tên dòng xe khách quan tâm hoặc null"}[/SHOW_LEAD_FORM]
5. Khi khách hàng có nhu cầu đặt lịch bảo dưỡng định kỳ, sửa chữa xe -> Hãy giới thiệu về dịch vụ bảo dưỡng và đính kèm form đặt lịch:
   [SHOW_SERVICE_FORM]{"step":"request"}[/SHOW_SERVICE_FORM]
6. KHÔNG tự bịa thông tin không có trong dữ liệu xe hoặc đại lý ở trên.
7. Nếu không trả lời được, gợi ý liên hệ Hotline 0918 90 90 60.

## NHẬN DIỆN LEAD (RẤT QUAN TRỌNG)
Ở cuối mỗi phản hồi, nếu khách hàng đã cung cấp thông tin liên hệ (Tên, SĐT) trong cuộc hội thoại hoặc vừa gửi form, bạn BẮT BUỘC phải đính kèm thẻ nhận diện lead dạng ẩn ở cuối cùng:
[LEAD_DATA]{"name":"Tên khách hoặc null","phone":"SĐT khách hoặc null","vehicle":"Xe quan tâm hoặc null","score":"hot|warm|cold"}[/LEAD_DATA]

Phân loại score:
- hot: Đã điền form đăng ký lái thử/báo giá/đặt lịch dịch vụ thành công HOẶC đã cung cấp số điện thoại cùng nhu cầu rõ ràng.
- warm: Khách hàng hỏi chi tiết về khuyến mãi, tính giá lăn bánh, so sánh thông số kỹ thuật xe cụ thể nhưng chưa cung cấp số điện thoại.
- cold: Khách hàng chỉ chào hỏi, hỏi thông tin chung chung.
PROMPT;
    }

    /**
     * Trích xuất lead data từ response của AI
     */
    private function extractLeadData(string $response, string $userMessage): ?array
    {
        // Check for embedded lead data tag
        if (preg_match('/\[LEAD_DATA\](.*?)\[\/LEAD_DATA\]/s', $response, $matches)) {
            $json = json_decode($matches[1], true);
            if ($json && isset($json['score'])) {
                return $json;
            }
        }

        // Fallback: detect phone numbers in user message
        if (preg_match('/(?:0\d{9,10}|\+84\d{9,10})/', $userMessage, $phoneMatch)) {
            return [
                'phone' => $phoneMatch[0],
                'score' => 'warm',
            ];
        }

        return null;
    }

    /**
     * Xóa metadata/tags ẩn khỏi response trước khi gửi cho user
     */
    private function cleanResponse(string $text): string
    {
        // Remove LEAD_DATA tags
        $text = preg_replace('/\[LEAD_DATA\].*?\[\/LEAD_DATA\]/s', '', $text);

        return trim($text);
    }

    /**
     * Viết bài viết hoặc tạo nội dung bài viết bằng AI
     */
    public function generateArticle(array $params): array
    {
        if (empty($this->apiKey)) {
            return [
                'success' => false,
                'message' => 'API Key Gemini chưa được cấu hình.',
            ];
        }

        $topic = $params['topic'] ?? '';
        $tone = $params['tone'] ?? 'chuyên nghiệp';
        $language = $params['language'] ?? 'vi';
        $keywords = $params['keywords'] ?? '';
        $outline = $params['outline'] ?? '';

        $prompt = "Bạn là chuyên gia marketing chuyên viết bài blog và tin tức chuẩn SEO cho thương hiệu xe hơi Long Khánh Ford.\n";
        $prompt .= "Hãy viết một bài viết hoàn chỉnh và chất lượng cao bằng tiếng " . ($language === 'vi' ? 'Việt' : 'Anh') . " về chủ đề: \"{$topic}\".\n";
        $prompt .= "Giọng điệu bài viết: {$tone}.\n";
        if (!empty($keywords)) {
            $prompt .= "Các từ khóa cần lồng ghép tự nhiên: {$keywords}.\n";
        }
        if (!empty($outline)) {
            $prompt .= "Bám sát dàn ý sau để viết:\n{$outline}\n";
        }
        
        $prompt .= "\n### Yêu Cầu Về Cấu Trúc Đầu Ra:\n";
        $prompt .= "Bạn PHẢI trả về kết quả định dạng JSON thuần túy (không bọc trong thẻ Markdown ```json ... ```) gồm các trường sau:\n";
        $prompt .= "{\n";
        $prompt .= "  \"title\": \"Tiêu đề bài viết hấp dẫn, thu hút người đọc và chuẩn SEO\",\n";
        $prompt .= "  \"description\": \"Mô tả ngắn (meta description) tóm tắt bài viết trong khoảng 150-160 ký tự\",\n";
        $prompt .= "  \"content\": \"Nội dung bài viết chi tiết viết bằng định dạng HTML (sử dụng các thẻ h2, h3, p, strong, ul, li để cấu trúc bài viết đẹp mắt và chuyên nghiệp)\"\n";
        $prompt .= "}\n";

        try {
            $response = Http::timeout(60)->post(
                "{$this->baseUrl}/models/{$this->model}:generateContent?key={$this->apiKey}",
                [
                    'contents' => [
                        [
                            'role' => 'user',
                            'parts' => [['text' => $prompt]],
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'maxOutputTokens' => 2048,
                        'responseMimeType' => 'application/json',
                    ],
                ]
            );

            if (!$response->successful()) {
                Log::error('Gemini Article generation failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return [
                    'success' => false,
                    'message' => 'Lỗi kết nối Gemini API: ' . $response->status(),
                ];
            }

            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
            
            $json = json_decode(trim($text), true);
            if (!$json || !isset($json['content'])) {
                return [
                    'success' => false,
                    'message' => 'Không thể phân tích dữ liệu JSON trả về từ AI.',
                    'raw_text' => $text,
                ];
            }

            return [
                'success' => true,
                'data' => $json,
            ];
        } catch (\Throwable $e) {
            Log::error('generateArticle exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Sinh nội dung cho các section layout trong trang thiết kế xe
     */
    public function generateBlockContent(array $params): array
    {
        if (empty($this->apiKey)) {
            return [
                'success' => false,
                'message' => 'API Key Gemini chưa được cấu hình.',
            ];
        }

        $vehicleTitle = $params['vehicle_title'] ?? 'xe Ford';
        $sectionType = $params['section_type'] ?? '';
        $fieldType = $params['field_type'] ?? '';
        $userPrompt = $params['user_prompt'] ?? '';

        $prompt = "Bạn là chuyên gia marketing chuyên viết nội dung quảng cáo xe hơi cho thương hiệu Long Khánh Ford.\n";
        $prompt .= "Hãy viết nội dung cho trường \"{$fieldType}\" thuộc phần \"{$sectionType}\" của xe \"{$vehicleTitle}\".\n";
        if (!empty($userPrompt)) {
            $prompt .= "Yêu cầu đặc biệt từ khách hàng: \"{$userPrompt}\".\n";
        }
        $prompt .= "\n### Yêu Cầu Về Nội Dung:\n";
        $prompt .= "- Phải phù hợp hoàn toàn với dòng xe {$vehicleTitle} và mục đích hiển thị của {$sectionType} (ví dụ: Promotions thì tập trung vào chương trình khuyến mãi, ưu đãi; FeaturesGrid thì tập trung vào thiết kế, tính năng kỹ thuật nổi bật; HeroBanner thì là slogan/tiêu đề chính cực kỳ hấp dẫn).\n";
        $prompt .= "- Ngắn gọn, súc tích, văn phong chuyên nghiệp, cuốn hút người đọc.\n";
        $prompt .= "- CHỈ trả về đúng chuỗi ký tự nội dung kết quả cuối cùng bằng tiếng Việt (không thêm lời dẫn, không thêm nhãn, không bọc trong dấu ngoặc kép hay markdown, không thêm ký tự đặc biệt thừa).\n";

        try {
            $response = Http::timeout(30)->post(
                "{$this->baseUrl}/models/{$this->model}:generateContent?key={$this->apiKey}",
                [
                    'contents' => [
                        [
                            'role' => 'user',
                            'parts' => [['text' => $prompt]],
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'maxOutputTokens' => 500,
                    ],
                ]
            );

            if (!$response->successful()) {
                Log::error('Gemini Block Content generation failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return [
                    'success' => false,
                    'message' => 'Lỗi kết nối Gemini API: ' . $response->status(),
                ];
            }

            $data = $response->json();
            $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
            $text = trim($text);
            
            // Clean quotes if AI wrapped them
            $text = preg_replace('/^["\'\s]+|["\'\s]+$/u', '', $text);

            return [
                'success' => true,
                'content' => $text,
            ];
        } catch (\Throwable $e) {
            Log::error('generateBlockContent exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return [
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage(),
            ];
        }
    }
}
