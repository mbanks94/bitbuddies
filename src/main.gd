extends Node

@export var loading_scene: PackedScene
@export var world_scene: PackedScene

var loading: Node

func _ready():
	loading = loading_scene.instantiate()
	add_child(loading)
	loading.game_loaded.connect(_on_game_loaded)

func _on_game_loaded():
	var world_scene = world_scene.instantiate()
	add_child(world_scene)
	remove_child(loading)
