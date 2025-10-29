package com.arc_manager.controllers;

import com.arc_manager.domain.entities.LootItem;
import com.arc_manager.services.LootItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/loot-item")
@Validated
public class LootItemController {

    private final LootItemService lootItemService;

    LootItemController(LootItemService lootItemService){
        this.lootItemService = lootItemService;
    }

    @GetMapping()
    public ResponseEntity<List<LootItem>> getAll(){
        return ResponseEntity.ok(lootItemService.getAll());
    }

    @PostMapping()
    public ResponseEntity<LootItem> create(
            @RequestBody LootItem request
    ){
        return ResponseEntity.ok(lootItemService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LootItem> update(
            @PathVariable("id") Long id,
            @RequestBody LootItem request
    ){

        return ResponseEntity.ok(lootItemService.update(id,request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<LootItem> delete(
            @PathVariable("id") Long id
    ){
        return ResponseEntity.ok(lootItemService.delete(id));
    }
}
