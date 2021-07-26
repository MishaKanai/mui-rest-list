import React from "react";
import makeAdhocList from "../components/makeAdhocList";
import { delay, map } from "rxjs/operators";
import { ajaxGetJSON } from "rxjs/internal/observable/dom/AjaxObservable";
import { Card } from "@material-ui/core";

type StarWarsPersonSearch = {
  count: number;
  next: string;
  previous: string;
  results: {
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    homeworld: string;
    films: string[];
    species: string[];
    vehicles: string[];
    starships: string[];
    created: string;
    edited: string;
    url: string;
  }[];
};

const { AdhocList, AdhocListColumn } = makeAdhocList<
  StarWarsPersonSearch["results"][0]
>();

const getDataObservable = (params: { size: number; page: number }) =>
  ajaxGetJSON<StarWarsPersonSearch>(
    `https://swapi.py4e.com/api/people/?search=&page=${params.page}`
  ).pipe(
    map((d) => ({
      total: d.count,
      data: d.results,
    }))
  );
export const StarWarsCharacterList = () => {
  return (
    <Card style={{ margin: "1em", padding: "1em" }}>
      <AdhocList
        type="paginated"
        titleOptions={{
          type: "Typography",
          TypographyProps: {
            variant: "h4",
          },
          text: "Star Wars Characters",
        }}
        pagesNIndexed={1}
        defaultSize={10}
        paginationOptions={10}
        hasRefresh={true}
        getDataObservable={getDataObservable}
        tableCaption="Star Wars Characters"
      >
        <AdhocListColumn title="name" fieldKey="name" />
        <AdhocListColumn title="height" fieldKey="height" />
        <AdhocListColumn title="mass" fieldKey="mass" />
        <AdhocListColumn title="homeworld" fieldKey="homeworld" />
      </AdhocList>
    </Card>
  );
};
