defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game
  alias Memory.BackupAgent

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = BackupAgent.get(name) || Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      BackupAgent.put(name, game)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("reset", payload, socket) do
    name = socket.assigns[:name]
    game = Game.new()
    socket = socket 
    |> assign(:game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end
  def handle_in("click", %{"tile_ind" => tile_ind}, socket) do
    name = socket.assigns[:name]
    game = Game.click(socket.assigns[:game], tile_ind)
    socket = socket
    |> assign(:game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end
  def handle_in("hide_tiles", payload, socket) do
    name = socket.assigns[:name]
    game = Game.hide_tiles(socket.assigns[:game]) 
    socket = socket
    |> assign(:game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  defp authorized?(_payload) do
    true
  end
end
