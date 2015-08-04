<?php

namespace EllisLab\Addons\Forum\Model;

use EllisLab\ExpressionEngine\Service\Model\Model;

/**
 * ExpressionEngine - by EllisLab
 *
 * @package		ExpressionEngine
 * @author		EllisLab Dev Team
 * @copyright	Copyright (c) 2003 - 2014, EllisLab, Inc.
 * @license		https://ellislab.com/expressionengine/user-guide/license.html
 * @link		http://ellislab.com
 * @since		Version 3.0
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * ExpressionEngine Board Model for the Forum
 *
 * A model representing a board in the Forum.
 *
 * @package		ExpressionEngine
 * @subpackage	Forum Module
 * @category	Model
 * @author		EllisLab Dev Team
 * @link		http://ellislab.com
 */
class Board extends Model {

	protected static $_primary_key = 'board_id';
	protected static $_table_name = 'forum_boards';

	protected static $_typed_columns = array(
		'board_enabled'              => 'boolString',
		'board_site_id'              => 'int',
		'board_alias_id'             => 'int',
		'board_allow_php'            => 'boolString',
		'board_install_date'         => 'timestamp',
		'board_topics_perpage'       => 'int',
		'board_posts_perpage'        => 'int',
		'board_hot_topic'            => 'int',
		'board_max_post_chars'       => 'int',
		'board_post_timelock'        => 'int',
		'board_display_edit_date'    => 'boolString',
		'board_allow_img_urls'       => 'boolString',
		'board_auto_link_urls'       => 'boolString',
		'board_max_attach_perpost'   => 'int',
		'board_max_attach_size'      => 'int',
		'board_max_width'            => 'int',
		'board_max_height'           => 'int',
		'board_use_img_thumbs'       => 'boolString',
		'board_thumb_width'          => 'int',
		'board_thumb_height'         => 'int',
		'board_forum_permissions'    => 'serialized',
		'board_use_deft_permissions' => 'boolString',
		'board_recent_poster_id'     => 'int',
		'board_enable_rss'           => 'boolString',
		'board_use_http_auth'        => 'boolString',
	);

	// protected static $_relationships = array(
	// );

	protected static $_validation_rules = array(
		'board_label'                => 'required',
		'board_name'                 => 'required|unique|alphaDash',
		'board_enabled'              => 'enum[y,n]',
		'board_forum_trigger'        => 'required|unique[board_site_id]|alphaDash|validateForumTrigger[board_site_id]',
		'board_allow_php'            => 'enum[y,n]',
		'board_php_stage'            => 'enum[i,o]',
		'board_forum_url'            => 'required',
		'board_default_theme'        => 'required',
		'board_upload_path'          => 'writable|validateUploadPath',
		'board_topic_order'          => 'enum[r,a,d]',
		'board_post_order'           => 'enum[a,d]',
		'board_display_edit_date'    => 'enum[y,n]',
		'board_allow_img_urls'       => 'enum[y,n]',
		'board_auto_link_urls'       => 'enum[y,n]',
		'board_use_img_thumbs'       => 'enum[y,n]',
		'board_forum_permissions'    => 'required',
		'board_use_deft_permissions' => 'enum[y,n]',
		'board_enable_rss'           => 'enum[y,n]',
		'board_use_http_auth'        => 'enum[y,n]',
	);

	protected static $_events = array(
		'beforeInsert',
	);

	protected $board_id;
	protected $board_label;
	protected $board_name;
	protected $board_enabled;
	protected $board_forum_trigger;
	protected $board_site_id;
	protected $board_alias_id;
	protected $board_allow_php;
	protected $board_php_stage;
	protected $board_install_date;
	protected $board_forum_url;
	protected $board_default_theme;
	protected $board_upload_path;
	protected $board_topics_perpage;
	protected $board_posts_perpage;
	protected $board_topic_order;
	protected $board_post_order;
	protected $board_hot_topic;
	protected $board_max_post_chars;
	protected $board_post_timelock;
	protected $board_display_edit_date;
	protected $board_text_formatting;
	protected $board_html_formatting;
	protected $board_allow_img_urls;
	protected $board_auto_link_urls;
	protected $board_notify_emails;
	protected $board_notify_emails_topics;
	protected $board_max_attach_perpost;
	protected $board_max_attach_size;
	protected $board_max_width;
	protected $board_max_height;
	protected $board_attach_types;
	protected $board_use_img_thumbs;
	protected $board_thumb_width;
	protected $board_thumb_height;
	protected $board_forum_permissions;
	protected $board_use_deft_permissions;
	protected $board_recent_poster_id;
	protected $board_recent_poster;
	protected $board_enable_rss;
	protected $board_use_http_auth;

	public function validateUploadPath($key, $value, $params, $rule)
	{
		if ($value != '')
		{
			if ( ! @is_dir($value))
			{
				return 'invalid_upload_path';
			}
		}

		return TRUE;
	}

	public function validateForumTrigger($key, $value, $params, $rule)
	{
		$field = $params[0];
		if ( ! $this->getProperty($field))
		{
			$rule->skip();
		}

		$count = $this->getFrontend()->get('TemplateGroup')
			->filter('group_name', $value)
			// ¯\_(ツ)_/¯ I'm not sure != makes sense, but it's what was
			// in 2.x so...
			->filter('site_id', '!=', $this->getProperty($field))
			->count();

		if ($count > 0)
		{
			return 'forum_trigger_unavailable';
		}

		return TRUE;
	}

	public function onBeforeInsert()
	{
		if ( ! $this->board_install_date)
		{
			$this->board_install_date = ee()->localize->now;
		}
	}

	public function set__board_forum_url($url)
	{
		$this->setRawProperty('board_forum_url', $this->addTrailingSlash($url));
	}

	public function set__board_upload_path($path)
	{
		$this->setRawProperty('board_upload_path', $this->addTrailingSlash($path));
	}

	private function addTrailingSlash($value)
	{
		if (isset($value)
			&& $value != ''
			&& substr($value, -1) != '/')
		{
			$value .= '/';
		}

		return $value;
	}

	public function getPermission($key)
	{
		if ( ! isset($this->board_forum_permissions[$key]))
		{
			return array();
		}

		return explode('|', $this->board_forum_permissions[$key]);
	}

	public function setPermssion($key, $value)
	{
		if (is_array($value))
		{
			$value = implode('|', $value);
		}

		$this->board_forum_permissions[$key] = $value;
	}

}
