extends Area2D

@onready var animation: AnimatedSprite2D = $AnimatedSprite2D

func _ready() -> void:
	await get_tree().create_timer(3.0).timeout
	animation.play()

func _process(delta: float) -> void:
	pass
