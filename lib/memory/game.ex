defmodule Memory.Game do

  def gen_letters() do
    letters = ["A", "B", "C", "D", "E", "F", "G", "H"]
    Enum.concat(letters, letters)
    |> Enum.shuffle
  end 

  def gen_tiles_exposure() do
    List.duplicate(false, 16)
  end

  def new do
    %{
      exposed_tile_ind: nil,
      failed_guess: false,
      guess_tile_ind: nil,
      ignore_clicks: false,
      num_clicks: 0,
      pairs_matched: 0,
      shuffled_letters: gen_letters(),
      tiles_exposure: gen_tiles_exposure(),
    }
  end

  def client_view(game) do
    %{
      failed_guess: game.failed_guess,
      num_clicks: game.num_clicks,
      pairs_matched: game.pairs_matched,
      shuffled_letters: game.shuffled_letters,
      tiles_exposure: game.tiles_exposure,
    }  
  end

  def click(game, tile_ind) do
    IO.puts("clicking...")
    cond do
      game.ignore_clicks -> 
        game
        |> Map.put(:failed_guess, false)
      Enum.at(game.tiles_exposure, tile_ind) ->
        game
        |> Map.put(:failed_guess, false)
      game.exposed_tile_ind == tile_ind -> 
        game
        |> Map.put(:failed_guess, false)
      game.exposed_tile_ind == nil -> 
        increment_clicks(game)
        |> expose_tile(tile_ind)        
        |> Map.put(:failed_guess, false)
      true ->
        increment_clicks(game) 
        |> guess_tile(tile_ind)
    end
  end
  
  # set tile_exposure to false for game.tile_ind and tile_ind, and allow clicks
  def hide_tiles(game, tile_ind) do
    IO.puts("flip tile")
    game
    |> hide_tile(game.exposed_tile_ind)
    |> hide_tile(tile_ind)
    |> Map.put(:exposed_tile_ind, nil)
    |> Map.put(:guess_tile_ind, nil)
    |> Map.put(:ignore_clicks, false)
  end
  def hide_tiles(game) do 
    game
    |> hide_tile(game.exposed_tile_ind)
    |> hide_tile(game.guess_tile_ind)
    |> Map.put(:exposed_tile_ind, nil)
    |> Map.put(:guess_tile_ind, nil)
    |> Map.put(:ignore_clicks, false)
  end

  defp hide_tile(game, tile_ind) do
    IO.puts("hide")
    IO.puts(tile_ind)
    game
    |> Map.put(:tiles_exposure, List.replace_at(game.tiles_exposure, tile_ind, false))
  end
  defp expose_tile(game, tile_ind) do
    IO.puts("expose")
    game = 
      if (game.exposed_tile_ind == nil) do
        game |> Map.put(:exposed_tile_ind, tile_ind)
      else
        game
    end
    game  
    |> Map.put(:tiles_exposure, List.replace_at(game.tiles_exposure, tile_ind, true))
#    |> Map.put(:exposed_tile_ind, tile_ind)
  end

  defp guess_tile(game, tile_ind) do
    IO.puts("guess")
    if (Enum.at(game.shuffled_letters, tile_ind) == Enum.at(game.shuffled_letters, game.exposed_tile_ind)) do
      increment_matches(game)
      |> expose_tile(tile_ind)
      |> Map.put(:exposed_tile_ind, nil)
      |> Map.put(:failed_guess, false)
    else
      game
      |> expose_tile(tile_ind)
      |> Map.put(:guess_tile_ind, tile_ind)
      |> Map.put(:ignore_clicks, true)
      |> Map.put(:failed_guess, true)
    end
  end

  defp increment_clicks(game) do
    game
    |> Map.put(:num_clicks, game.num_clicks + 1)
  end

  defp increment_matches(game) do
    game
    |> Map.put(:pairs_matched, game.pairs_matched + 1)
  end

end
