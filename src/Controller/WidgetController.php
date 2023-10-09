<?php

namespace Drupal\custom_rss_widget\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Controller for serving the external JS widget.
 */
class WidgetController extends ControllerBase
{

  /**
   * The extension list module.
   *
   * @var \Drupal\Core\Extension\ModuleExtensionList
   */
  protected $moduleExtensionList;

  /**
   * Constructs a WidgetController object.
   *
   * @param \Drupal\Core\Extension\ModuleExtensionList $module_extension_list
   *   The extension list module.
   */
  public function __construct($module_extension_list)
  {
    $this->moduleExtensionList = $module_extension_list;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container)
  {
    return new static(
      $container->get('extension.list.module')
    );
  }

  public function getExternalCSS($theme_name)
  {
    $path = $this->moduleExtensionList->getPath('custom_rss_widget') . "/css/$theme_name.css";
    $content = file_get_contents($path);

    return new Response($content, 200, ['Content-Type' => 'text/css']);
  }

  /**
   * Returns the JavaScript for the external widget.
   */
  public function getExternalJS()
  {
    $path = $this->moduleExtensionList->getPath('custom_rss_widget') . '/js/widget-external.js';
    $content = file_get_contents($path);

    // Yer tutucuyu gerçek domain değeriyle değiştirin
    $currentDomain = $_SERVER['HTTP_HOST'];

    // Eğer alan adı *.nada.org ise başa https:// ekleyin, değilse http:// ekleyin
    $protocol = (strpos($currentDomain, '.nada.org') !== false) ? 'https://' : 'http://';

    $domain = $protocol . $currentDomain;
    $content = str_replace('%%DOMAIN_PLACEHOLDER%%', $domain, $content);

    return new Response($content, 200, ['Content-Type' => 'application/javascript']);
  }


}
