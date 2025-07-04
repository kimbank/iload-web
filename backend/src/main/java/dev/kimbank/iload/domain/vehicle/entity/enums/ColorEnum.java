package dev.kimbank.iload.domain.vehicle.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ColorEnum {
    // 화이트
    WHITE("WHITE", "화이트"),
    // 블랙
    BLACK("BLACK", "블랙"),
    // 진주색
    PEARL("PEARL", "진주색"),
    // 실버
    SILVER("SILVER", "실버"),
    // 그레이
    GRAY("GRAY", "그레이"),
    // 차콜/쥐색
    CHARCOAL("CHARCOAL", "차콜/쥐색"),
    // 네이비
    NAVY("NAVY", "네이비"),
    // 빨간색
    RED("RED", "빨간색"),
    // 노란색
    YELLOW("YELLOW", "노란색"),
    // 초록색
    GREEN("GREEN", "초록색"),
    // 파란색
    BLUE("BLUE", "파란색"),
    // 연금색
    LIGHT_GOLD("LIGHT_GOLD", "연금색"),
    // 갈색
    BROWN("BROWN", "갈색"),
    // 금색
    GOLD("GOLD", "금색"),
    // 하늘색
    SKY_BLUE("SKY_BLUE", "하늘색"),
    // 청옥색
    TURQUOISE("TURQUOISE", "청옥색"),
    // 연두색
    LIGHT_GREEN("LIGHT_GREEN", "연두색"),
    // 분홍색
    PINK("PINK", "분홍색"),
    // 주황색
    ORANGE("ORANGE", "주황색"),
    // 기타
    OTHER("OTHER", "기타");

    private final String code;
    private final String description;
}
