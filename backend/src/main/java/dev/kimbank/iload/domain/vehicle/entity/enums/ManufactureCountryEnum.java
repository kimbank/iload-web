package dev.kimbank.iload.domain.vehicle.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ManufactureCountryEnum {
    KOREA("KOREA", "대한민국"),
    USA("USA", "미국"),
    GERMANY("GERMANY", "독일"),
    JAPAN("JAPAN", "일본"),
    OTHER("OTHER", "기타");

    private final String code;
    private final String description;
}
