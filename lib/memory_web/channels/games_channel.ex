defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("reset", payload, socket) do
    game = Game.new()
    socket = socket 
    |> assign(:game, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end
  def handle_in("click", %{"tile_ind" => tile_ind}, socket) do
    game = Game.click(socket.assigns[:game], tile_ind)
    socket = socket
    |> assign(:game, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end
  def handle_in("hide_tiles", %{"tile_ind" => tile_ind}, socket) do
    game = Game.hide_tiles(socket.assigns[:game], tile_ind)
    socket = socket
    |> assign(:game, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  defp authorized?(_payload) do
    true
  end
end
