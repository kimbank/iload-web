package dev.kimbank.iload.domain.main;

import dev.kimbank.iload.domain.vehicle.dto.RegisteredVehicleCardResponse;
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
    public List<RegisteredVehicleCardResponse> findLatestRegisteredVehicles() {
        return mainService.findLatestRegisteredVehicles();
    }

    @GetMapping("/high-price-vehicles")
    public List<RegisteredVehicleCardResponse> findHighPriceVehicles() {
        return mainService.findHighPriceVehicles();
    }

    @GetMapping("/registered-vehicles")
    public Page<RegisteredVehicleCardResponse> findRegisteredVehicleCardsByCondition(
            @RequestParam Boolean noAccident,
            @RequestParam Boolean noPaint,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return mainService.findRegisteredVehicleCardsByCondition(noAccident, noPaint, pageable);
    }
}
