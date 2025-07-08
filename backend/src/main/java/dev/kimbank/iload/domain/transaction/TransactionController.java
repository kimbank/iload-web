package dev.kimbank.iload.domain.transaction;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/transaction")
@Tag(name = "Transaction", description = "거래 관련 API")
class TransactionController {

}
