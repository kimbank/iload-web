package dev.kimbank.iload.domain.price;

import dev.kimbank.iload.domain.price.dto.PriceDetailResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/price")
@Tag(name = "Price", description = "가격 정보 관련 API")
class PriceController {
    private final PriceService priceService;

    @GetMapping("/details")
    @Operation(summary = "가격 상세 정보 조회",
            description = "사용자의 차량 ID를 기반으로 가격 상세 정보를 조회합니다.")
    public PriceDetailResponse getPriceDetails(
             @RequestParam Long vehicleId) {
        return priceService.getPriceDetails(vehicleId);
    }
}
