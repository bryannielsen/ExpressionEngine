/*!
 * ExpressionEngine - by EllisLab
 *
 * @package		ExpressionEngine
 * @author		EllisLab Dev Team
 * @copyright	Copyright (c) 2003 - 2014, EllisLab, Inc.
 * @license		http://ellislab.com/expressionengine/user-guide/license.html
 * @link		http://ellislab.com
 * @since		Version 3.0
 * @filesource
 */

$(document).ready(function () {
	// Only confirm removals
	$('select[name="bulk_action"]').change(function () {
		$('.tbl-bulk-act .submit').toggleClass('m-link', $(this).val() == 'remove');
	});

	$('.tbl-bulk-act .submit').click(function (e) {
		if ($('select[name="bulk_action"]').val() == 'remove')
		{
			$(".modal-confirm-all .checklist").html(''); // Reset it
			if ($('td input:checked').length < 6) {
				$('td input:checked').each(function() {
					$(".modal-confirm-all .checklist").append('<li>' + $(this).attr('data-confirm') + '</li>');
				});
			} else {
				$(".modal-confirm-all .checklist").append('<li>' + EE.lang.remove_confirm.replace('###', $('td input:checked').length) + '</li>');
			}
			// Add hidden <input> elements
			$('td input:checked').each(function() {
				$(".modal-confirm-all .checklist li:last").append('<input type="hidden" name="' + $(this).attr('name') + '" value="' + $(this).val() + '">');
			});
			$(".modal-confirm-all .checklist li:last").addClass('last');
		}
	});
});