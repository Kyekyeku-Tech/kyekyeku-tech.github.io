<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag; ?>
<?php foreach($attributes->onlyProps([
    'link' => '',
    'title' => '',
    'value' => '',
    'icon' => '',
    'image' => '',
    'bg' => 'primary',
    'color' => 'white',
    'icon_color' => null,
]) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
} ?>
<?php $attributes = $attributes->exceptProps([
    'link' => '',
    'title' => '',
    'value' => '',
    'icon' => '',
    'image' => '',
    'bg' => 'primary',
    'color' => 'white',
    'icon_color' => null,
]); ?>
<?php foreach (array_filter(([
    'link' => '',
    'title' => '',
    'value' => '',
    'icon' => '',
    'image' => '',
    'bg' => 'primary',
    'color' => 'white',
    'icon_color' => null,
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
} ?>
<?php $__defined_vars = get_defined_vars(); ?>
<?php foreach ($attributes as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
} ?>
<?php unset($__defined_vars); ?>

<?php
    $iconColor = $icon_color ?? $color;
?>

<div class="card bg--<?php echo e($bg); ?> overflow-hidden box--shadow2">
    <?php if($link): ?>
        <a href="<?php echo e($link); ?>" class="item-link"></a>
    <?php endif; ?>
    <div class="card-body">
        <div class="row align-items-center">
            <div class="col-4">
                
                <img style="height: 100%; width: 100%; max-width: 100px" src="<?php echo e($image); ?>" alt="">
            </div>
            <div class="col-8 text-end">
                <span class="text--<?php echo e($color); ?> text--small"><?php echo e(__($title)); ?></span>
                <h2 class="text--<?php echo e($color); ?>"><?php echo e($value); ?></h2>
            </div>
        </div>
    </div>
</div>
<?php /**PATH /home/suntechp/ye.suntech.pw/h25/core/resources/views/components/widget-1.blade.php ENDPATH**/ ?>