defmodule Memory.Game do

  def gen_letters() do
    letters = ["A", "B", "C", "D", "E", "F", "G", "H"]
    Enum.concat(letters, letters)
    |> Enum.shuffle
  end 

  def gen_tiles_exposure() do
    List.duplicate(true, 16)
  end

  def new do
    %{
      exposed_tile_index: nil,
      num_clicks: 0,
      pairs_matched: 0,
      shuffled_letters: gen_letters(),
      tiles_exposure: gen_tiles_exposure(),
    }
  end

  def client_view(game) do
    %{
      num_clicks: game.num_clicks,
      pairs_matched: game.pairs_matched,
      shuffled_letters: game.shuffled_letters,
      tiles_exposure: gen_tiles_exposure(),
    }  
  end

  def click(game, tile_ind) do

    game
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
