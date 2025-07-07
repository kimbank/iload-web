package dev.kimbank.iload.domain.main;

import dev.kimbank.iload.domain.vehicle.dto.RegisteredVehicleCardResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/main")
@RequiredArgsConstructor
@Tag(name="Main", description = "메인 페이지 (비회원 포함)")
class MainController {
    private final MainService mainService;

    @GetMapping("/latest-registered-vehicles")
    @Operation(summary = "최신 등록 차량 조회",
            description = "최신 등록 2대의 차량을 반환합니다.")
    public List<RegisteredVehicleCardResponse> findLatestRegisteredVehicles() {
        return mainService.findLatestRegisteredVehicles();
    }

    @GetMapping("/high-price-vehicles")
    @Operation(summary = "고가 차량 조회",
            description = "가격이 높은 차량 4대를 반환합니다.")
    public List<RegisteredVehicleCardResponse> findHighPriceVehicles() {
        return mainService.findHighPriceVehicles();
    }

    @GetMapping("/registered-vehicles")
    @Operation(summary = "등록 차량 카드 조회",
            description = "등록된 차량 카드 목록을 조건에 따라 조회합니다.")
    public Page<RegisteredVehicleCardResponse> findRegisteredVehicleCardsByCondition(
            @RequestParam Boolean noAccident,
            @RequestParam Boolean noPaint,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return mainService.findRegisteredVehicleCardsByCondition(noAccident, noPaint, pageable);
    }
}
