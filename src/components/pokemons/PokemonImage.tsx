import {
  component$,
  useComputed$,
  useSignal,
  useTask$,
} from '@builder.io/qwik';

interface Props {
  id: string | number;
  size?: number;
  backImage?: boolean;
  isVisible?: boolean;
}

export const PokemonImage = component$(
  ({ id, size = 300, backImage = false, isVisible = true }: Props) => {
    const imageLoaded = useSignal(false);

    useTask$(({ track }) => {
      track(() => id);
      imageLoaded.value = false;
    });

    const imageUrl = useComputed$(() => {
      if (id === '') return '';

      return backImage
        ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`
        : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    });

    return (
      <div
        class="flex items-center justify-center"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {!imageLoaded.value && <span>Cargando....</span>}
        <img
          width="96"
          height="96"
          src={imageUrl.value}
          alt="Pokemon Sprite"
          style={{ width: `${size}px` }}
          onLoad$={() => {
            imageLoaded.value = true;
          }}
          class={[
            { hidden: !imageLoaded.value, 'brightness-0': !isVisible },
            'transition-all',
          ]}
        />
      </div>
    );
  }
);
