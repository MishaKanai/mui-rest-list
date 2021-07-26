import React from "react";
import makeAdhocList from "../components/makeAdhocList";
import { delay, map } from "rxjs/operators";
import { ajaxGetJSON } from "rxjs/internal/observable/dom/AjaxObservable";
import { Card } from "@material-ui/core";

type PokemonSearch = {
  count: number;
  next: string;
  previous: string;
  results: {
    id:number
    name: string
    order:number
    gender_rate:number
    capture_rate:number
    base_happiness:number
    is_baby:boolean
    is_legendary:boolean;
    is_mythical:boolean;
    hatch_counter:number;
    has_gender_differences:boolean;
    forms_switchable:boolean;
    growth_rate: {
      name: string;
      url: string;
    }
    pokedex_numbers: {
      entry_number: number;
      pokedex: {
        name: string;
        url: string;
      }
    }[]
    egg_groups: {
      name: string;
      url: string;
    }[]
    color: {
      name: string;
      url: string;
    }
    shape: {
      name: string;
      url: string;
    }
    evolves_from_species: {
      name: string;
      url: string;
    };
    evolution_chain: {
      url: string;
    }
    generation: {
      name: string;
      url: string;
    }
    names: {
      name: string;
    }[];
  }[];
};

const { AdhocList, AdhocListColumn } = makeAdhocList<
  PokemonSearch["results"][0]
>();

const getDataObservable = (params: { size: number; page: number }) =>
  ajaxGetJSON<PokemonSearch>(
    `https://pokeapi.co/api/v2/pokemon-species/?offset=${(params.page - 1) * params.size}&limit=${params.size}`
  ).pipe(
    map((d) => ({
      total: d.count,
      data: d.results,
    }))
  );
export const MaxCountPokemonList = () => {
  return (
    <Card style={{ margin: "1em", padding: "1em" }}>
      <AdhocList
        type="paginated"
        titleOptions={{
          type: "Typography",
          TypographyProps: {
            variant: "h4",
          },
          text: "Pokemon species",
        }}
        pagesNIndexed={1}
        maxExactTotalCount={20}
        defaultSize={80}
        hasRefresh={true}
        getDataObservable={getDataObservable}
        tableCaption="Pokemon species"
        
      >
        <AdhocListColumn title="name" fieldKey="name" />
      </AdhocList>
    </Card>
  );
};
