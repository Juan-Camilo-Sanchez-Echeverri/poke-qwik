import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { PokemonImage } from '~/components/pokemons/PokemonImage';

export const usePokemonId = routeLoader$<number>(({ params, redirect }) => {
  const id = Number(params.id);
  if (isNaN(id)) throw redirect(301, '/');

  if (id <= 0) throw redirect(301, '/');

  if (id > 1000) throw redirect(301, '/');

  return id;
});

export default component$(() => {
  // const location = useLocation();
  const pokemonId = usePokemonId();

  return (
    <>
      <span class="text-5xl">Pokemon : {pokemonId}</span>
      {/* <span class="text-5xl">Pokemon : {location.params.id}</span> */}
      <PokemonImage id={pokemonId.value} />
    </>
  );
});
