extends CanvasLayer

signal game_loaded

func _ready() -> void:
	await get_tree().create_timer(3.0).timeout
	game_loaded.emit()
