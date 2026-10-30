import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type {
  PriceAdjustmentRule,
  SpecialItem,
  WebAppRowGraphQL,
} from "@zauru-sdk/types";
import {
  calculateItemPriceFromWeeklyMatrix,
  matchSpecialItemForWeeklyPrice,
} from "./weeklyItemPrice.utils.js";

const specialItem = (
  id: number,
  data: Partial<SpecialItem>,
): WebAppRowGraphQL<SpecialItem> =>
  ({
    id,
    data: {
      item: 490550,
      provider: 0,
      region: "0",
      tipo: "0",
      providerCategory: 0,
      fechaEliminacion: "",
      detalles: "",
      specialLabel: "",
      ...data,
    },
  }) as WebAppRowGraphQL<SpecialItem>;

const rule = (
  nombre: string,
  prioridad: number,
  tipoValor: PriceAdjustmentRule["tipoValor"],
  valor: number,
): PriceAdjustmentRule => ({
  nombre,
  prioridad,
  activa: true,
  operacion: "add",
  tipoValor,
  valor,
  filtros: {
    itemMode: "all",
    itemIds: [],
    tipoMode: "all",
    tipos: [],
    programaMode: "all",
    providerCategoryIds: [],
  },
  fechaEliminacion: "",
});

describe("matchSpecialItemForWeeklyPrice", () => {
  it("treats stored zero values as wildcards and matches the provider category", () => {
    const mujeres = specialItem(552530, { providerCategory: 2955 });
    const socios = specialItem(552532, { providerCategory: 2954 });

    const match = matchSpecialItemForWeeklyPrice([mujeres, socios], {
      itemId: 490550,
      providerId: 868975,
      providerCategoryId: 2954,
      region: "SACATEPÉQUEZ,SANTA MARIA CAUQUE",
      tipo: "Certificado 1",
    });

    assert.equal(match?.id, 552532);
  });

  it("prefers the matching configuration with more filters", () => {
    const categoryOnly = specialItem(10, { providerCategory: 2954 });
    const providerAndCategory = specialItem(20, {
      provider: 868975,
      providerCategory: 2954,
    });

    const match = matchSpecialItemForWeeklyPrice(
      [categoryOnly, providerAndCategory],
      {
        itemId: 490550,
        providerId: 868975,
        providerCategoryId: 2954,
      },
    );

    assert.equal(match?.id, 20);
  });
});

describe("calculateItemPriceFromWeeklyMatrix", () => {
  it("uses the SOCIOS price before applying the certified and IVA rules", () => {
    const socios = specialItem(552532, { providerCategory: 2954 });

    const result = calculateItemPriceFromWeeklyMatrix({
      itemId: 490550,
      date: "2026-10-22",
      providerId: 868975,
      providerCategoryId: 2954,
      region: "SACATEPÉQUEZ,SANTA MARIA CAUQUE",
      tipo: "Certificado 1",
      specialItems: [socios],
      matrix: {
        fechas: {
          lunes: "2026/10/19",
          martes: "2026/10/20",
          miercoles: "2026/10/21",
          jueves: "2026/10/22",
          viernes: "2026/10/23",
          sabado: "2026/10/24",
          domingo: "2026/10/25",
        },
        costos: [
          { item: 490550, lunMar: 3.25, mieJue: 3.25, vieSabDom: 3.25 },
        ],
        costosEspeciales: [
          {
            specialItemId: 552532,
            lunMar: 3.35,
            mieJue: 3.35,
            vieSabDom: 3.35,
          },
        ],
      },
      rules: [
        rule("Productos certificados Zanahorias", 1, "amount", 0.25),
        rule("IVA aplicado", 2, "percentage", 2.5),
      ],
    });

    assert.equal(result.source, "especial");
    assert.equal(result.specialItemId, 552532);
    assert.equal(result.basePrice, 3.35);
    assert.equal(result.finalPrice, 3.69);
    assert.equal(
      result.description,
      "3.35 (especial) + 0.25 (Productos certificados Zanahorias) + 2.5% (IVA aplicado) = 3.69",
    );
  });
});
